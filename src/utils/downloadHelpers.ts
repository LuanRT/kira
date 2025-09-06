import type { SabrFormat } from 'googlevideo/shared-types';

export interface StartDownloadOptions {
  selectedFormat: SabrFormat;
  type: 'audio' | 'video';
  filename: string;
}

export function bytesToMB(bytes: number): string {
  if (bytes === 0) return '0';
  return (bytes / (1024 * 1024)).toFixed(2);
}

export function bitrateToKbps(bitrate: number): string {
  return `${Math.round(bitrate / 1000)}kbps`;
}

export function getFormatLabel(format: SabrFormat): string {
  if (format.mimeType?.startsWith('video/')) {
    return format.qualityLabel || `${format.height}p`;
  }

  if (format.mimeType?.startsWith('audio/')) {
    return format.audioQuality?.replace('AUDIO_QUALITY_', '') || 'Audio';
  }
  return 'File';
}

export function determineFileExtension(mimeType: string): string {
  if (mimeType.includes('video')) {
    return mimeType.includes('webm') ? 'webm' : 'mp4';
  }
  if (mimeType.includes('audio')) {
    return mimeType.includes('webm') ? 'webm' : 'm4a';
  }
  return 'bin';
}

export function createFileName(videoTitle: string, type: 'audio' | 'video', mimeType: string, qualityLabel?: string): string {
  const sanitizedTitle = videoTitle?.replace(/[^a-z0-9]/gi, '_') || 'unknown';
  const extension = determineFileExtension(mimeType);
  return `${sanitizedTitle}.${type}${qualityLabel ? `.${qualityLabel}` : ''}.${extension}`;
}

export function createProgressStream(
  stream: ReadableStream<Uint8Array>,
  contentLength: number | undefined,
  onProgress: (progress: number) => void
): ReadableStream<Uint8Array> {
  if (!contentLength) return stream;

  let bytesDownloaded = 0;
  return new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          bytesDownloaded += value.length;
          onProgress((bytesDownloaded / contentLength) * 100);
          controller.enqueue(value);
        }
      } finally {
        controller.close();
      }
    }
  });
}