<style scoped>
.related-video-item {
  display: flex;
  margin-bottom: 12px;
  cursor: pointer;
}

.thumbnail-container {
  position: relative;
  flex-shrink: 0;
}

.thumbnail {
  border-radius: 8px;
  background-color: #333;
}

.duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 500;
}

.video-details {
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 0;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
}

.metadata {
  font-size: 12px;
  color: #aaa;
  margin: 0 0 5px;
}
</style>

<template>
  <router-link class="related-video-item" :to="`/watch/${data.videoId}`">
    <div class="thumbnail-container">
      <img 
        :src="data.thumbnail"
        alt="Video thumbnail"
        loading="lazy"
        class="thumbnail"
        @error="handleImageError($event.target as any)"
      >
      <span v-if="data.duration" class="duration">{{ data.duration }}</span>
    </div>
    <div class="video-details">
      <h4 class="title" v-html="data.title" :title="data.titleText" /> 
      <p class="metadata" v-for="metadataItem in data.metadata">{{ metadataItem }}</p>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { handleImageError, VideoItemData } from '@/utils/helpers';
defineProps<{ data: VideoItemData }>();
</script>