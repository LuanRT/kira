<style scoped>
.grid-video-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  overflow: hidden;
}

.grid-video-item:hover {
  transform: translateY(-2px);
}

.thumbnail-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  height: auto;
  background-color: #333;
  margin-bottom: 8px;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.grid-video-item:hover .thumbnail {
  transform: scale(1.05);
}

.duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.bottom {
  display: flex;
  flex-direction: row;
}

.author-avatar-container {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-details {
  display: flex;
  margin-left: 12px;
  flex-direction: column;
  text-align: left;
  min-width: 0;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
}

.metadata-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-top: 4px;
  gap: 3px;
}

.metadata-row {
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.8rem;
  letter-spacing: -0.01em;
  display: block;
}
</style>

<template>
  <router-link class="grid-video-item" :to="`/watch/${data.videoId}`">
    <div class="thumbnail-container">
      <img
        :src="data.thumbnail"
        alt="Video thumbnail"
        loading="lazy"
        class="thumbnail"
        @error="handleImageError($event.target as any)"
      >
      <div v-if="data.duration" class="duration">{{ data.duration }}</div>
    </div>
    <div class="bottom">
      <div class="author-avatar-container" v-if="data.authorAvatar">
        <img
          :src="data.authorAvatar"
          alt="Author avatar"
          loading="lazy"
          @error="handleImageError($event.target as any)"
        >
      </div>
      <div class="video-details">
        <h4 class="title" v-html="data.title" :title="data.titleText"/>
        <div class="metadata-container">
          <span class="metadata-row" v-for="metadataItem in data.metadata">{{ metadataItem }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { handleImageError, VideoItemData } from '@/utils/helpers';

defineProps<{ data: VideoItemData }>();
</script>