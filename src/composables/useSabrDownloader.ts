import { ref } from 'vue';

import { useInnertube } from '@/composables/useInnertube';
import { useOnesieConfig } from '@/composables/useOnesieConfig';
import { useToastStore } from '@/stores/toastStore';

import { botguardService } from '@/services/botguard';
import { makePlayerRequest } from '@/services/onesie';

import type { OnesieHotConfig } from '@/utils/helpers';
import { checkExtension, fetchFunction } from '@/utils/helpers';
import type { StartDownloadOptions } from '@/utils/downloadHelpers';
import { createProgressStream } from '@/utils/downloadHelpers';

import { SabrStream } from 'googlevideo/sabr-stream';
import { buildSabrFormat, EnabledTrackTypes } from 'googlevideo/utils';
import type { SabrFormat } from 'googlevideo/shared-types';

import type { Innertube } from 'youtubei.js/web';
import { Constants, YT } from 'youtubei.js/web';

import { showSaveFilePicker } from 'native-file-system-adapter';

let sabrStream: SabrStream | null = null;
const videoTitle = ref<string>('');
const isChoosingFormats = ref(false);
const isPreparingDownload = ref(false);
const isDownloading = ref(false);
const downloadProgress = ref(0);
const sabrFormats = ref<SabrFormat[]>([]);

export function useSabrDownloader() {
  const { addToast } = useToastStore();
  const getInnertube = useInnertube();
  const getClientConfig = useOnesieConfig();
  
  let aborted = false;
  
  const MEMORY_DOWNLOAD_LIMIT = 3 * 1024 * 1024 * 1024;

  async function getPlayerInfo(innertube: Innertube, clientConfig: OnesieHotConfig, videoId: string) {
    const requestParams = {
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
      playbackContext: {
        adPlaybackContext: {
          pyv: true
        },
        contentPlaybackContext: {
          signatureTimestamp: innertube.session.player?.sts
        }
      }
    };

    const rawPlayerResponse = await makePlayerRequest({
      clientConfig,
      innertubeRequest: { context: innertube.session.context, ...requestParams }
    });

    return new YT.VideoInfo([ rawPlayerResponse ], innertube.actions, '');
  }

  async function initializeSabrStream(innertube: Innertube, playerResponse: YT.VideoInfo) {
    const contentBinding = innertube.session.context.client.visitorData;
    const serverAbrStreamingUrl = innertube.session.player?.decipher(playerResponse.streaming_data?.server_abr_streaming_url);
    const videoPlaybackUstreamerConfig = playerResponse.player_config?.media_common_config.media_ustreamer_request_config?.video_playback_ustreamer_config;
    const formats = playerResponse.streaming_data?.adaptive_formats.map(buildSabrFormat) || [];

    if (!contentBinding)
      throw new Error('Failed to retrieve content binding for download.');

    if (!videoPlaybackUstreamerConfig || !serverAbrStreamingUrl || formats.length === 0)
      throw new Error('Failed to retrieve required video data for download.');

    videoTitle.value = playerResponse.basic_info.title || 'unknown_video';
    sabrFormats.value = formats;

    sabrStream = new SabrStream({
      formats,
      serverAbrStreamingUrl,
      videoPlaybackUstreamerConfig,
      fetch: (input, init) => checkExtension() ? fetch(input, init) : fetchFunction(input, init),
      poToken: await botguardService.integrityTokenBasedMinter?.mintAsWebsafeString(contentBinding),
      clientInfo: {
        clientName: parseInt(Constants.CLIENT_NAME_IDS[innertube.session.context.client.clientName as keyof typeof Constants.CLIENT_NAME_IDS]),
        clientVersion: innertube.session.context.client.clientVersion
      }
    });
  }

  async function openDownloadDialog(videoId: string) {
    isPreparingDownload.value = true;
    try {
      const clientConfig = await getClientConfig();
      const innertube = await getInnertube();
      const playerResponse = await getPlayerInfo(innertube, clientConfig, videoId);

      if (playerResponse.basic_info.is_live || playerResponse.basic_info.is_post_live_dvr) {
        addToast('Live or post-live videos are not supported for download.', 'info');
        return;
      }

      await initializeSabrStream(innertube, playerResponse);
      isChoosingFormats.value = true;
    } catch (error: any) {
      console.error('[useSabrDownloader] Error preparing download:', error);
      addToast(error.message || 'Failed to prepare download. Check console for details.', 'error');
    } finally {
      isPreparingDownload.value = false;
    }
  }

  async function createDownloadStream(type: 'audio' | 'video', selectedFormat: SabrFormat) {
    if (!sabrStream)
      throw new Error('SABR stream not initialized.');

    const audioFormat = type === 'audio' ? selectedFormat : sabrFormats.value.find((fmt) => fmt.mimeType?.includes('audio'));
    const videoFormat = type === 'video' ? selectedFormat : sabrFormats.value.find((fmt) => fmt.mimeType?.includes('video'));

    const { videoStream, audioStream } = await sabrStream.start({
      audioFormat,
      videoFormat,
      enabledTrackTypes: type === 'audio' ? EnabledTrackTypes.AUDIO_ONLY : EnabledTrackTypes.VIDEO_ONLY
    });

    const originalStream = type === 'audio' ? audioStream : videoStream;
    if (!originalStream)
      throw new Error('Could not create a download stream.');

    return createProgressStream(originalStream, selectedFormat.contentLength, (progress) => {
      downloadProgress.value = progress;
    });
  }

  async function startDownload({ selectedFormat, type, filename }: StartDownloadOptions) {
    if (!selectedFormat) {
      addToast('Selected format not found.', 'error');
      return;
    }

    const contentLength = selectedFormat.contentLength;
    const supportsFileSystemAccess = 'showSaveFilePicker' in window;

    if (!supportsFileSystemAccess && contentLength && contentLength > MEMORY_DOWNLOAD_LIMIT) {
      addToast('This download may fail due to size limitations. Consider using a browser that supports the File System Access API.', 'info');
    }

    isDownloading.value = true;
    downloadProgress.value = 0;

    try {
      const mimeType = selectedFormat.mimeType?.split(';')[0] || '';

      const fileHandle = await showSaveFilePicker({
        suggestedName: filename,
        types: [ {
          description: 'Media File',
          accept: { [mimeType]: [ `.${filename.split('.').pop()}` ] }
        } ]
      });

      addToast('Downloading...\nKeep this window open to continue.', 'info');
      const stream = await createDownloadStream(type, selectedFormat);
      const writable = await fileHandle.createWritable();
      await stream.pipeTo(writable);
      addToast(aborted ? 'Download aborted.' : 'Downloaded.', 'info');
    } catch (err: any) {
      console.error('[useSabrDownloader]', 'Error during download:', err);
      addToast(err.message || 'Failed to save the file.', 'error');
    } finally {
      isDownloading.value = false;
      downloadProgress.value = 0;
      videoTitle.value = '';
      isChoosingFormats.value = false;
      aborted = false;
      sabrStream = null;
      sabrFormats.value = [];
    }
  }

  function abortDownload() {
    aborted = true;
    if (sabrStream) {
      sabrStream.abort();
      sabrStream = null;
    }
    isDownloading.value = false;
    downloadProgress.value = 0;
    videoTitle.value = '';
    isChoosingFormats.value = false;
    sabrFormats.value = [];
  }

  return {
    isChoosingFormats,
    isPreparingDownload,
    isDownloading,
    downloadProgress,
    sabrFormats,
    openDownloadDialog,
    startDownload,
    abortDownload
  };
}