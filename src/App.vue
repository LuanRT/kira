<style>
html {
  overflow-y: scroll;
}

body {
  background-color: #202020;
  margin: 0;
}

.app {
  display: flex;
  font-family: Arial, sans-serif;
  text-align: center;
  flex-direction: column;
  align-items: center;
}

/* Webkit scrollbars are ugly. */
::-webkit-scrollbar {
  width: 10px;
  background-color: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 8px;
  border: 2px solid #202020;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.main-content {
  width: 100%;
  overflow-y: auto;
}

.search-container {
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  box-sizing: border-box;
  background: #202020;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.home-button {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  transition: color 0.2s ease;
}

.home-button:hover {
  color: #fff;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #aaa;
  display: flex;
  align-items: center;
}

.clear-search {
  position: absolute;
  right: 12px;
  font-size: 22px;
  color: #aaa;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #fff;
}

.search-input {
  width: 100%;
  padding: 12px 40px;
  font-size: 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3ea6ff;
  background: #333;
  outline: none;
  box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);
}

.loader {
  position: absolute;
  right: 14px;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3ea6ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-results,
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  background: #242424;
  border: 1px solid #444;
  border-radius: 8px;
  max-height: 450px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.search-result-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #333;
  transition: background 0.2s;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover, .search-result-item.highlighted {
  background: #333;
}

.thumbnail-container {
  width: 180px;
  height: 100px;
  margin-right: 14px;
  background: #1a1a1a;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.search-result-item:hover .thumbnail {
  transform: scale(1.05);
}

.duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.video-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.title {
  font-size: 16px;
  margin-bottom: 6px;
  color: white;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  font-weight: 500;
}

.channel {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 4px;
}

.meta {
  font-size: 12px;
  color: #888;
}

.empty-results {
  text-align: center;
  color: #aaa;
  padding: 24px;
  background: #242424;
  border-radius: 8px;
  margin-top: 8px;
}

.empty-results svg {
  color: #666;
  margin-bottom: 12px;
}

.settings-button {
  color: #aaa;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, background-color 0.2s ease;
  margin-left: 8px;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.settings-button:hover {
  color: #fff;
  background-color: #333;
}

@media (max-width: 1024px) {
  ::-webkit-scrollbar {
    display: none;
  }

  * {
    scrollbar-width: none;
  }

  body {
    overflow: hidden;
  }

  .app {
    margin: 12px;
    height: calc(100vh - 24px);
    overflow-y: scroll;
  }


  .empty-results,
  .search-results {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .search-container {
    justify-content: space-between;
    gap: 12px;
  }

  .home-button {
    position: static;
    transform: none;
  }

  .search-input-wrapper {
    max-width: calc(100% - 84px);
  }

  .empty-results,
  .search-results {
    left: auto;
    right: 0;
    transform: none;
  }

  .search-results {
    width: calc(100% - 36px);
  }

  .empty-results {
    width: calc(100% - 50px);
  }

  .settings-button {
    transform: none;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    position: static;
  }
}
</style>

<template>
  <div class="app">
    <div class="search-container">
      <router-link to="/" class="home-button" aria-label="Go to homepage">
        <HomeIcon/>
      </router-link>
      <div class="search-input-wrapper">
        <div class="search-icon">
          <SearchIcon/>
        </div>
        <input
          v-model="searchQuery"
          placeholder="Search videos..."
          @input="handleSearch"
          @keydown.down.prevent="navigateResults('down')"
          @keydown.up.prevent="navigateResults('up')"
          @keydown.enter="selectHighlightedVideo"
          class="search-input"
        />
        <div v-if="searchQuery && !isLoading" class="clear-search" @click="clearSearch">×</div>
        <div v-if="isLoading" class="loader"></div>
      </div>
      <button class="settings-button" @click="showSettingsDialog = true" aria-label="Open settings">
        <SettingsIcon/>
      </button>
      <div v-if="searchResults.length" class="search-results">
        <div
          v-for="(result, index) in searchResults"
          :key="result.id"
          class="search-result-item"
          :class="{ 'highlighted': index === highlightedIndex }"
          @click="selectVideo(result.id)"
          @mouseenter="highlightedIndex = index"
        >
          <div class="thumbnail-container">
            <img
              :src="result.thumbnail"
              class="thumbnail"
              :alt="result.title"
              loading="lazy"
              @error="handleImageError($event.target as any)"
            />
            <div class="duration">{{ result.duration || '??:??' }}</div>
          </div>
          <div class="video-info">
            <div class="title">{{ result.title }}</div>
            <div class="channel">{{ result.channel }}</div>
            <div v-if="result.views" class="meta">{{ result.views }}</div>
          </div>
        </div>
      </div>
      <div v-else-if="searchQuery && !isLoading" class="empty-results">
        <SadFaceIcon/>
        <p>No videos found. Try a different search term.</p>
      </div>
    </div>
    <div class="main-content">
      <router-view/>
    </div>
    <ToastNotification/>
    <SettingsDialog
      v-if="showSettingsDialog"
      @close="showSettingsDialog = false"
      @save="saveSettings"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

import ToastNotification from '@/components/ToastNotification.vue';
import SettingsDialog from '@/components/SettingsDialog.vue';

import HomeIcon from '@/components/icons/HomeIcon.vue';
import SadFaceIcon from '@/components/icons/SadFaceIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import SettingsIcon from '@/components/icons/SettingsIcon.vue';

import { useDebounce } from '@/composables/useDebounce';
import { useProxySettings } from '@/composables/useProxySettings';
import { useToastStore } from '@/stores/toastStore';

import { Innertube, UniversalCache, YTNodes } from 'youtubei.js/web';
import { base64ToU8 } from 'googlevideo/utils';
import { botguardService } from '@/services/botguard';

import {
  CLIENT_CONFIG_STORAGE_KEY,
  OnesieHotConfig,
  REDIRECTOR_STORAGE_KEY,
  checkExtension,
  configImageHttpProxy,
  fetchFunction,
  handleImageError,
  isConfigValid,
  isFirstTime,
  loadCachedClientConfig, ProxySettings
} from './utils/helpers';

const router = useRouter();
const { addToast } = useToastStore();
const { isProxyConfigured, setSettings } = useProxySettings();

let innertubePromise: Promise<Innertube | undefined> | undefined;
let clientConfigPromise: Promise<OnesieHotConfig | undefined> | undefined;
const innertubeInstance = shallowRef<Innertube | undefined>(undefined);
const clientConfigObject = shallowRef<OnesieHotConfig | undefined>(undefined);

const searchQuery = ref('');
const searchResults = ref<{
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string | null;
  views?: string | null;
}[]>([]);

const isLoading = ref(false);
const highlightedIndex = ref(-1);
const showSettingsDialog = ref(false);

async function initInnertube() {
  const firstTime = await isFirstTime();

  try {
    console.info('[App]', `Initializing InnerTube API [firstTime=${firstTime}]`);

    const instance = await Innertube.create({
      cache: new UniversalCache(true),
      fetch: fetchFunction
    });

    botguardService.init().then((bgClient) => {
      console.info('[App]', 'BotGuard client initialized');
      Object.assign(window, { botguardService, bgClient }); // For testing and stuff.
    });

    // Preload the redirector URL to avoid extra delays later...
    const redirectorResponse = await fetchFunction(`https://redirector.googlevideo.com/initplayback?source=youtube&itag=0&pvi=0&pai=0&owc=yes&cmo:sensitive_content=yes&alr=yes&id=${Math.round(Math.random() * 1E5)}`, { method: 'GET' });
    const redirectorResponseUrl = await redirectorResponse.text();

    if (redirectorResponseUrl.startsWith('https://')) {
      localStorage.setItem(REDIRECTOR_STORAGE_KEY, redirectorResponseUrl);
    }

    innertubeInstance.value = instance;
    return instance;
  } catch (error) {
    addToast('Failed to initialize InnerTube API', 'error');
    console.error('[App]', 'Failed to initialize Innertube', error);
    innertubePromise = undefined;

    // YouTube.js will fall back to local session generation if this is the first
    // time the app is loaded, and the request to /sw.js_data fails for some reason.
    // Since local sessions may cause playback issues, delete the IndexedDB database 
    // to force it to regenerate.
    // @TODO: Add a setting in YouTube.js to disable this crap (local session fallback).
    if (firstTime) {
      const request = indexedDB.deleteDatabase('youtubei.js');
      request.onsuccess = () => console.info('[App]', 'Deleted bad session cache.');
    }

    return undefined;
  }
}

async function fetchOnesieHotConfig(): Promise<OnesieHotConfig | undefined> {
  const cachedConfig = loadCachedClientConfig();
  if (cachedConfig) {
    clientConfigObject.value = cachedConfig;
    return cachedConfig;
  }

  try {
    const tvConfigResponse = await fetchFunction('https://www.youtube.com/tv_config?action_get_config=true&client=lb4&theme=cl', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version'
      }
    });

    const tvConfigJson = JSON.parse((await tvConfigResponse.text()).slice(4));
    const webPlayerContextConfig = tvConfigJson.webPlayerContextConfig.WEB_PLAYER_CONTEXT_CONFIG_ID_LIVING_ROOM_WATCH;
    const onesieHotConfig = webPlayerContextConfig.onesieHotConfig;

    const config = {
      clientKeyData: base64ToU8(onesieHotConfig.clientKey),
      keyExpiresInSeconds: onesieHotConfig.keyExpiresInSeconds,
      encryptedClientKey: base64ToU8(onesieHotConfig.encryptedClientKey),
      onesieUstreamerConfig: base64ToU8(onesieHotConfig.onesieUstreamerConfig),
      baseUrl: onesieHotConfig.baseUrl,
      timestamp: Date.now()
    };

    localStorage.setItem(CLIENT_CONFIG_STORAGE_KEY, JSON.stringify(config));

    clientConfigObject.value = config;
    return config;
  } catch (error) {
    console.error('[App]', 'Failed to fetch Onesie client config', error);
    clientConfigPromise = undefined;
    return undefined;
  }
}

async function getInnertube() {
  if (innertubeInstance.value) return innertubeInstance.value;
  if (!innertubePromise) innertubePromise = initInnertube();
  return innertubePromise;
}

async function getClientConfig() {
  if (clientConfigObject.value) {
    if (!isConfigValid(clientConfigObject.value)) {
      clientConfigPromise = undefined;
      clientConfigObject.value = undefined;
      localStorage.removeItem(CLIENT_CONFIG_STORAGE_KEY);
      return fetchOnesieHotConfig();
    }
    return clientConfigObject.value;
  }

  if (!clientConfigPromise) clientConfigPromise = fetchOnesieHotConfig();
  return clientConfigPromise;
}

const performSearch = async () => {
  if (!searchQuery.value.length) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;

  try {
    const innertube = await getInnertube();
    if (!innertube) return;

    const search = await innertube.actions.execute('/search', { query: searchQuery.value, parse: true });

    if (!search.contents_memo) {
      searchResults.value = [];
      return;
    }

    const results = search.contents_memo?.getType(YTNodes.Video, YTNodes.CompactVideo);

    if (results) {
      searchResults.value = results.map((result) => ({
        id: result.video_id,
        title: result.title.toString(),
        channel: result.author?.name || 'Unknown',
        thumbnail: result.thumbnails[0].url,
        duration: result.duration?.text || null,
        views: result.view_count?.text || null
      }));
      highlightedIndex.value = searchResults.value.length > 0 ? 0 : -1;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('[App]', 'Search failed', error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = useDebounce(performSearch, 300);

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
  highlightedIndex.value = -1;
}

function navigateResults(direction: 'up' | 'down') {
  if (searchResults.value.length === 0) return;

  if (direction === 'down') {
    highlightedIndex.value = (highlightedIndex.value + 1) % searchResults.value.length;
  } else {
    highlightedIndex.value = highlightedIndex.value <= 0
      ? searchResults.value.length - 1
      : highlightedIndex.value - 1;
  }
}

function selectHighlightedVideo() {
  if (highlightedIndex.value >= 0 && searchResults.value[highlightedIndex.value]) {
    selectVideo(searchResults.value[highlightedIndex.value].id);
  }
}

function selectVideo(id: string) {
  clearSearch();
  router.push(`/watch/${id}`);
}

const saveSettings = (newSettings: ProxySettings) => {
  setSettings(newSettings);
  showSettingsDialog.value = false;
};

provide('innertube', getInnertube);
provide('onesieHotConfig', getClientConfig);

innertubePromise = initInnertube();
clientConfigPromise = fetchOnesieHotConfig();

onMounted(async () => {
  const isExtensionInstalled = checkExtension();

  if (!isProxyConfigured.value && !isExtensionInstalled) {
    showSettingsDialog.value = true;
  }

  if (!isExtensionInstalled && isProxyConfigured.value) {
    configImageHttpProxy();
  }
});
</script>