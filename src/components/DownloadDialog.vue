<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dialog-content {
  background: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #444;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 500px;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-active .dialog-content,
.fade-leave-active .dialog-content {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-from .dialog-content, .fade-leave-to .dialog-content {
  transform: translateY(-20px);
  opacity: 0;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #444;
}

.dialog-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #aaa;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.close-button:hover, .close-button:focus {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

.dialog-body {
  padding: 20px 24px;
  flex: 1;
  overflow-y: auto;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
}

.form-input, .form-select {
  padding: 10px 12px;
  font-size: 16px;
  background: #202020;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  border-color: #3ea6ff;
  background: #333;
  outline: none;
  box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #252525;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  padding-right: 40px;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #aaa;
  pointer-events: none;
}

/* Pill-style Radio Buttons */
.radio-group-pills {
  display: flex;
  background-color: #202020;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #444;
}

.radio-pill {
  flex: 1;
  position: relative;
}

.radio-pill input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.radio-pill span {
  display: block;
  text-align: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.radio-pill input:checked + span {
  background-color: #4a4a4a;
  color: #fff;
}

.radio-pill input:not(:checked) + span {
  color: #ccc;
}

.quality-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
}

.quality-item {
  display: block;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.quality-item input {
  position: absolute;
  opacity: 0;
}

.quality-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 8px;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.quality-item:hover .quality-item-content {
  background-color: #333;
}

.quality-item input:checked + .quality-item-content {
  border-color: #3ea6ff;
  background-color: rgba(62, 166, 255, 0.1);
}

.quality-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quality-label {
  font-weight: 500;
  color: #f5f5f5;
}

.quality-details {
  font-size: 12px;
  color: #aaa;
}

.quality-size {
  font-size: 14px;
  font-weight: 500;
  color: #f5f5f5;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #888;
  background-color: #202020;
  border-radius: 8px;
  border: 1px dashed #444;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #444;
  background-color: #2a2a2a;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--primary {
  background-color: #3ea6ff;
  color: white;
}

.button--primary:hover:not(:disabled) {
  background-color: #57b2ff;
}

.button--secondary {
  background-color: #444;
  color: #f5f5f5;
}

.button--secondary:hover:not(:disabled) {
  background-color: #555;
}
</style>

<template>
  <Teleport to="body">
    <Transition name="fade" appear @after-leave="onAfterLeave">
      <div
        v-if="visible"
        class="dialog-overlay"
        @click.self="handleClose"
        @keydown.esc="handleClose"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabindex="-1"
        ref="dialogRef"
      >
        <div class="dialog-content">
          <header class="dialog-header">
            <h2 id="dialog-title" class="dialog-title">Download Options</h2>
            <button
              class="close-button"
              @click="handleClose"
              aria-label="Close download dialog"
              type="button"
            >
              <CloseIcon/>
            </button>
          </header>
          <div class="dialog-body">
            <form @submit.prevent="handleDownload" class="settings-form">
              <div class="form-group">
                <label class="form-label">Type</label>
                <div class="radio-group-pills">
                  <label class="radio-pill">
                    <input type="radio" v-model="downloadType" value="video" name="download-type">
                    <span>Video</span>
                  </label>
                  <label class="radio-pill">
                    <input type="radio" v-model="downloadType" value="audio" name="download-type">
                    <span>Audio</span>
                  </label>
                </div>
              </div>
              <div class="form-group" v-if="downloadType === 'audio' && audioLanguages.length > 1">
                <label for="audio-language" class="form-label">Language</label>
                <div class="select-wrapper">
                  <select id="audio-language" v-model="selectedAudioLanguage" class="form-select">
                    <option v-for="lang in audioLanguages" :key="lang" :value="lang">{{ lang }}</option>
                  </select>
                  <ArrowDownIcon class="select-icon"/>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Quality</label>
                <div class="quality-list" v-if="availableQualities.length > 0">
                  <label v-for="format in availableQualities" :key="FormatKeyUtils.getUniqueFormatId(format)"
                         class="quality-item">
                    <input type="radio" :value="FormatKeyUtils.getUniqueFormatId(format)" v-model="selectedFormatId"
                           name="quality-selection">
                    <div class="quality-item-content">
                      <div class="quality-info">
                        <span class="quality-label">{{ getFormatLabel(format) }}</span>
                        <span class="quality-details">{{ getFormatDetails(format) }}</span>
                      </div>
                      <div class="quality-size">
                        {{ format.contentLength ? bytesToMB(format.contentLength) + ' MB' : 'Unknown Size' }}
                      </div>
                    </div>
                  </label>
                </div>
                <div v-else class="empty-state">
                  No {{ downloadType }} qualities available.
                </div>
              </div>

              <div class="form-group">
                <label for="filename" class="form-label">Filename</label>
                <input type="text" id="filename" v-model="filename" class="form-input" :disabled="!selectedFormat">
              </div>
            </form>
          </div>
          <footer class="dialog-footer">
            <button
              class="button button--secondary"
              @click="handleClose"
              type="button"
            >
              Cancel
            </button>
            <button
              class="button button--primary"
              @click="handleDownload"
              :disabled="!selectedFormat"
              type="button"
            >
              Download
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { FormatKeyUtils } from 'googlevideo/utils';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import type { SabrFormat } from 'googlevideo/shared-types';

import {
  bitrateToKbps,
  bytesToMB,
  createFileName,
  determineFileExtension,
  getFormatLabel,
  StartDownloadOptions,
} from '@/utils/downloadHelpers';

const { formats, videoTitle } = defineProps<{
  formats: SabrFormat[];
  videoTitle: string;
}>();

const emit = defineEmits<{
  close: [];
  startDownload: [ options: StartDownloadOptions ]
}>();

const visible = ref(true);
const dialogRef = ref<HTMLElement>();
const downloadType = ref<'video' | 'audio'>('video');
const selectedFormatId = ref<string | number>('');
const filename = ref('');

const videoFormats = computed(() => formats.filter((f) => f.mimeType?.startsWith('video/')).sort((a, b) => (b.height || 0) - (a.height || 0)));
const audioFormats = computed(() => formats.filter((f) => f.mimeType?.startsWith('audio/')).sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0)));

const audioLanguages = computed(() => {
  const languages = new Set(audioFormats.value.map((f) => f.language || 'Undetermined'));
  return Array.from(languages);
});

const selectedAudioLanguage = ref(audioLanguages.value[0] || 'Undetermined');

const availableQualities = computed(() => {
  if (downloadType.value === 'video') {
    return videoFormats.value;
  }
  return audioFormats.value.filter((f) => (f.language || 'Undetermined') === selectedAudioLanguage.value);
});

const selectedFormat = computed(() => {
  return availableQualities.value.find((f) => FormatKeyUtils.getUniqueFormatId(f) === selectedFormatId.value);
});

watch([ availableQualities ], () => {
  // Reset tge selected format when switching between video and audio.
  if (!availableQualities.value.some((f) => FormatKeyUtils.getUniqueFormatId(f) === selectedFormatId.value)) {
    selectedFormatId.value = FormatKeyUtils.getUniqueFormatId(availableQualities.value[0]);
  }
}, { immediate: true });

watch(selectedFormat, (newFormat) => {
  if (newFormat) {
    filename.value = createFileName(
      videoTitle,
      downloadType.value,
      newFormat.mimeType || '',
      newFormat.qualityLabel || newFormat.audioQuality?.replace('AUDIO_QUALITY_', '')
    );
  } else {
    filename.value = '';
  }
}, { immediate: true });

function handleClose() {
  visible.value = false;
}

function onAfterLeave() {
  emit('close');
}

function getFormatDetails(format: SabrFormat): string {
  const extension = determineFileExtension(format.mimeType || '').toUpperCase();
  const bitrate = format.averageBitrate || format.bitrate;
  return `${extension} · ${bitrateToKbps(bitrate)}`;
}

function handleDownload() {
  if (!selectedFormat.value) return;
  emit('startDownload', {
    selectedFormat: selectedFormat.value,
    type: downloadType.value,
    filename: filename.value
  });
  handleClose();
}

onMounted(async () => {
  await nextTick();
  dialogRef.value?.focus();
});
</script>