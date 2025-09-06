import { reactive, computed, readonly } from 'vue';
import type { ProxySettings } from '@/utils/helpers';

const PROXY_SETTINGS_KEY = 'proxy_settings';

const settingsState = reactive<ProxySettings>({
  protocol: 'http',
  host: '',
  port: ''
});

function loadSettings() {
  try {
    const savedSettings = localStorage.getItem(PROXY_SETTINGS_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      Object.assign(settingsState, parsed);
    }
  } catch (e) {
    console.error('Failed to load proxy settings', e);
  }
}

function saveSettings() {
  localStorage.setItem(PROXY_SETTINGS_KEY, JSON.stringify(settingsState));
}

loadSettings();

export function useProxySettings() {
  const isProxyConfigured = computed(() => !!settingsState.host);

  const setSettings = (newSettings: ProxySettings) => {
    settingsState.host = newSettings.host;
    settingsState.port = newSettings.port;
    settingsState.protocol = newSettings.protocol;
    saveSettings();
    window.location.reload();
  };

  return {
    settings: readonly(settingsState),
    isProxyConfigured,
    setSettings
  };
}