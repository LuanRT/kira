<style scoped>
.watch-page {
  width: 100%;
  margin: 0 auto;
  max-width: 98%;
  display: flex;
  gap: 24px;
}

.primary {
  flex: 1;
  min-width: 0;
  margin-top: 15px;
}

.secondary {
  width: 402px;
  margin-top: 20px; /* Looks a bit weird at 15px for some reason, so we'll use 20px instead... */
}

@media (max-width: 1024px) {
  .watch-page {
    flex-direction: column;
    max-width: 100%;
  }

  .secondary {
    width: 100%;
    margin-top: 0;
  }
}

@media (min-width: 1600px) {
  .watch-page {
    max-width: calc(1200px + 402px + 24px);
  }
}

.video-info {
  margin-top: 10px;
}

.video-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #fff;
  text-align: left;
  overflow-wrap: break-word;
}

.metadata-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0 16px;
  border-bottom: 1px solid #5e5e5e7c;
}

.channel-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.channel-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.channel-name {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #fff;
}

.subscriber-count {
  color: #aaa;
  font-size: 13px;
}

.video-stats {
  color: #aaa;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 12px;
}

.description {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  position: relative;
  color: #fff;
  text-align: left;
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

:deep(a) {
  color: rgb(62, 166, 255);
  text-decoration: none;
}

:deep(a.yt-ch-link) {
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.102);
  border-radius: 10px;
  padding-bottom: 2px;
  padding-left: 5px;
  justify-content: center;
}

:deep(.shaka-overflow-menu),
:deep(.shaka-settings-menu) {
  border-radius: 10px;
  -webkit-transition: opacity .3s cubic-bezier(0, 0, .2, 1);
  transition: opacity .3s cubic-bezier(0, 0, .2, 1);
  animation: fade 0.2s;
  scrollbar-width: none
}

.separator {
  width: 1px;
  height: 24px;
  background-color: #5e5e5e7c;
}


.download-btn-container {
  position: relative;
  margin-left: 8px;
}

.download-btn {
  display: flex;
  align-items: center;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  min-width: 112px;
  height: 30px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  position: relative;
  justify-content: center;
  opacity: 0.7;
  z-index: 2;
  overflow: hidden;
}

.download-btn:hover {
  background: #393939;
}

.download-btn:disabled {
  cursor: not-allowed;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #4a4a4a;
  border-radius: 6px;
  z-index: -1;
  transition: width 0.1s linear;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="watch-page">
    <div class="primary">
      <VideoPlayer class="ytplayer" :videoId/>
      <div class="video-info" v-if="videoDetails">
        <h1 class="video-title" :title="videoDetails.title">{{ videoDetails.title }}</h1>
        <div class="metadata-row">
          <div class="channel-info">
            <img :src="videoDetails.channelAvatar" class="channel-avatar" alt="Channel avatar">
            <div class="channel-details">
              <h3 class="channel-name">{{ videoDetails.channelName }}</h3>
              <span class="subscriber-count">{{ videoDetails.subscribers }}</span>
            </div>
          </div>
          <div class="video-stats">
            <span class="views" v-if="videoDetails.views">{{ videoDetails.views }}</span>
            <span class="date" v-if="videoDetails.publishDate">{{ videoDetails.publishDate }}</span>
            <div class="separator"/>
            <div class="download-btn-container">
              <button class="download-btn" :title="isDownloading ? 'Cancel' : 'Download'" @click="isDownloading ? abortDownload() : openDownloadDialog(videoId)" :disabled="isPreparingDownload">
                <div class="progress-fill" v-if="isDownloading" :style="{ width: `${downloadProgress}%` }" />
                <div class="button-content">
                  <div v-if="isPreparingDownload" class="button-spinner"></div>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span style="margin-left:6px;">{{ isPreparingDownload ? 'Loading...' : (isDownloading ? `${Math.round(downloadProgress)}%` : 'Download') }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="description" v-if="videoDetails.description">
          <TextRenderer :contents="videoDetails.description"/>
        </div>
      </div>
    </div>
    <div class="secondary">
      <RelatedVideoItem v-for="item in relatedVideos" :key="item.videoId" :data="item"/>
    </div>
    <DownloadDialog
      v-if="isChoosingFormats"
      :formats="sabrFormats"
      :video-title="videoDetails?.title || ''"
      @close="isChoosingFormats = false"
      @start-download="startDownload"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import VideoPlayer from '@/components/VideoPlayer.vue';
import RelatedVideoItem from '@/components/RelatedVideoItem.vue';
import TextRenderer from '@/components/TextRenderer.vue';
import DownloadDialog from '@/components/DownloadDialog.vue';

import { useInnertube } from '@/composables/useInnertube';
import { useToastStore } from '@/stores/toastStore';
import { useSabrDownloader } from '@/composables/useSabrDownloader';

import { YTNodes } from 'youtubei.js/web';
import { VideoDetails, VideoItemData } from '@/utils/helpers';

const route = useRoute();
const { addToast } = useToastStore();
const getInnertube = useInnertube();

const {
  isChoosingFormats,
  isPreparingDownload,
  isDownloading,
  downloadProgress,
  sabrFormats,
  openDownloadDialog,
  startDownload,
  abortDownload
} = useSabrDownloader();

const videoId = ref(route.params.id.toString());
const relatedVideos = ref<VideoItemData[]>([]);
const videoDetails = ref<VideoDetails | undefined>();

async function fetchVideoInfo() {
  const innertube = await getInnertube();
  if (!innertube) return;

  try {
    const nextResponse = await innertube.actions.execute('/next', {
      videoId: videoId.value,
      parse: true
    });

    const videoPrimaryInfo = nextResponse.contents_memo?.getType(YTNodes.VideoPrimaryInfo).first();
    const videoSecondaryInfo = nextResponse.contents_memo?.getType(YTNodes.VideoSecondaryInfo).first();
    const secondaryResults = nextResponse.contents?.item().as(YTNodes.TwoColumnWatchNextResults).secondary_results;

    if (videoPrimaryInfo?.title)
      document.title = videoPrimaryInfo.title.toString();

    videoDetails.value = {
      title: videoPrimaryInfo?.title.toString() || '',
      channelName: videoSecondaryInfo?.owner?.author.name || '',
      channelAvatar: videoSecondaryInfo?.owner?.author.best_thumbnail?.url || '',
      subscribers: videoSecondaryInfo?.owner?.subscriber_count.toString() || '0 subscribers',
      views: videoPrimaryInfo?.view_count?.short_view_count.isEmpty() ? videoPrimaryInfo.view_count.view_count.toString() : videoPrimaryInfo?.view_count?.short_view_count.toString(),
      publishDate: videoPrimaryInfo?.relative_date.isEmpty() ? undefined : videoPrimaryInfo?.relative_date.toString(),
      description: videoSecondaryInfo?.description
    };

    if (secondaryResults) {
      for (const item of secondaryResults) {
        if (item.is(YTNodes.LockupView)) {
          if (item.content_type !== 'VIDEO')
            continue;

          const metadata = item.metadata;
          const contentImage = item.content_image;

          if (!metadata || !contentImage?.is(YTNodes.ThumbnailView))
            continue;

          const durationOverlay = contentImage.overlays?.find(
            (overlay) => overlay.is(YTNodes.ThumbnailOverlayBadgeView) && overlay.position === 'THUMBNAIL_OVERLAY_BADGE_POSITION_BOTTOM_END'
          )?.as(YTNodes.ThumbnailOverlayBadgeView);

          relatedVideos.value.push({
            videoId: item.content_id,
            title: metadata.title.toHTML() ?? '',
            titleText: metadata.title.toString(),
            thumbnail: contentImage.image[0].url,
            authorAvatar: metadata.image?.as(YTNodes.DecoratedAvatarView)?.avatar?.image[0].url,
            metadata: metadata.metadata?.metadata_rows.map(row => {
              return row.metadata_parts?.map(item => item.text?.toString()).join(metadata.metadata?.delimiter) || '';
            }) || [],
            duration: durationOverlay?.badges[0]?.text
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
    addToast('Failed to load video details.', 'error');
  }
}

watch(() => route.params.id, (newId) => {
  videoId.value = newId.toString();
  relatedVideos.value = [];
  videoDetails.value = undefined;
  document.title = 'Loading... - Kira';
  fetchVideoInfo();
});

onMounted(fetchVideoInfo);

onUnmounted(() => document.title = 'Kira');
</script>