<style scoped>
.home {
  color: #f5f5f5;
  display: flex;
  padding-top: 25px;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.separator span {
  margin: 0 10px;
  font-size: 14px;
  text-transform: lowercase;
}

.input-container input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  transition: all 0.2s;
}

.input-container input:focus {
  border-color: #3ea6ff;
  background: #333;
  outline: none;
  box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);
}

.recommendations-section {
  width: 100%;
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 500;
  color: #e0e0e0;
  margin: 0;
  text-align: left;
}

.toggle-recommendations {
  background: none;
  border: 1px solid #444;
  color: #aaa;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toggle-recommendations:hover {
  background: #333;
  color: #fff;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.recommendations-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: #aaa;
  font-size: 18px;
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .home {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>

<template>
  <div class="home">
    <div class="recommendations-section">
      <div class="section-header">
        <h2>Recommended Videos</h2>
        <button @click="toggleRecommendations" class="toggle-recommendations">
          {{ showRecommendations ? 'Hide' : 'Show' }}
        </button>
      </div>
      <template v-if="showRecommendations">
        <div v-if="loading" class="recommendations-state">
          <p>Loading...</p>
        </div>
        <div v-else-if="!homeRecommendations.length" class="recommendations-state">
          <p>Nothing to see here yet. Watch some videos and check back later!</p>
        </div>
        <div class="video-grid" v-else>
          <GridVideoItem
            v-for="video in homeRecommendations"
            :key="video.videoId"
            :data="video"
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import GridVideoItem from '@/components/GridVideoItem.vue';
import { useInnertube } from '@/composables/useInnertube';
import { useToastStore } from '@/stores/toastStore';
import { YTNodes } from 'youtubei.js/web';
import type { VideoItemData } from '@/utils/helpers';

const getInnertube = useInnertube();
const { addToast } = useToastStore();

const loading = ref(true);
const showRecommendations = ref(true);
const homeRecommendations = ref<VideoItemData[]>([]);

watch(showRecommendations, (val) => {
  localStorage.setItem('showRecommendations', val.toString());
});

function toggleRecommendations() {
  showRecommendations.value = !showRecommendations.value;
}

onMounted(async () => {
  loading.value = true;

  const saved = localStorage.getItem('showRecommendations');
  if (saved !== null) {
    showRecommendations.value = JSON.parse(saved);
  }
  
  const innertube = await getInnertube();
  if (!innertube) {
    loading.value = false;
    return;
  }
  
  try {
    const home = await innertube.getHomeFeed();

    if (home.page.contents_memo) {
      const items = home.page.contents_memo.getType(YTNodes.LockupView, YTNodes.Video);

      for (const item of items) {
        if (item.is(YTNodes.LockupView)) {
          if (item.content_type !== 'VIDEO') 
            continue;

          const metadata = item.metadata;
          const contentImage = item.content_image
          
          if (!metadata || !contentImage?.is(YTNodes.ThumbnailView)) 
            continue;
          
          const durationOverlay = contentImage.overlays.find(
            (overlay) => overlay.is(YTNodes.ThumbnailOverlayBadgeView) && overlay.position === 'THUMBNAIL_OVERLAY_BADGE_POSITION_BOTTOM_END'
          )?.as(YTNodes.ThumbnailOverlayBadgeView);

          homeRecommendations.value.push({
            videoId: item.content_id,
            title: metadata.title.toHTML() ?? '',
            titleText: metadata.title.toString(),
            thumbnail: contentImage.image[0].url,
            metadata: metadata.metadata?.metadata_rows.map(row => {
              return row.metadata_parts?.map(item => item.text?.toString()).join(metadata.metadata?.delimiter) || '';
            }) || [],
            duration: durationOverlay?.badges[0]?.text
          });
        } else if (item.is(YTNodes.Video)) {
          homeRecommendations.value.push({
            videoId: item.video_id,
            title: item.title.toHTML() ?? '',
            titleText: item.title.toString(),
            thumbnail: item.best_thumbnail?.url || '',
            authorAvatar: item.author.thumbnails[0].url,
            metadata: [
              item.author?.name.toString(),
              item.short_view_count ? [ 
                item.short_view_count?.toString(),
                item.published?.toString() 
              ].join(item.is_live ? '' : ' • ') : undefined
            ],
            duration: item.duration ? new Date(item.duration.seconds! * 1000).toISOString().substr(11, 8) : undefined
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    addToast('Failed to load recommendations.', 'error');
  } finally {
    loading.value = false;
  }
});
</script>