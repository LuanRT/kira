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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

.fade-enter-active .dialog-content,
.fade-leave-active .dialog-content {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.fade-enter-from .dialog-content,
.fade-leave-to .dialog-content {
  transform: translateY(-20px);
  opacity: 0;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #444;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.dialog-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.close-button {
  display: flex;
  color: #aaa;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
  padding: 6px;
  border-radius: 50%;
  align-items: center;
  width: 28px;
  height: 28px;
  justify-content: center;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.close-button:hover,
.close-button:focus {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

.dialog-body {
  padding: 0 24px;
  flex: 1;
  overflow-y: auto;
}

.info-text {
  display: grid;
  grid-template-columns: min-content auto;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid;
}

.info-text--success {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
  color: #4caf50;
}

.info-text--info {
  background-color: rgba(62, 166, 255, 0.1);
  border-color: rgba(62, 166, 255, 0.3);
  color: #3ea6ff;
}

.info-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text a {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid;
}

.info-text a:hover,
.info-text a:focus {
  text-decoration: none;
  opacity: 0.8;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
}

.form-input,
.form-select {
  padding: 10px 12px;
  font-size: 16px;
  background: #202020;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  border-color: #3ea6ff;
  background: #333;
  outline: none;
  box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);
}

.form-input--error {
  border-color: #f44336;
}

.form-input--error:focus {
  border-color: #f44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

.form-input:disabled,
.form-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
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

.form-error {
  margin-top: 6px;
  font-size: 12px;
  color: #f44336;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #444;
  margin-top: 24px;
}

.button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: center;
}

.button:disabled {
  opacity: 0.6;
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

.button-spinner {
  width: 16px;
  height: 16px;
  border: 4px solid transparent;
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

@media (max-width: 640px) {
  .dialog-content {
    width: 95%;
    max-height: 95vh;
  }

  .dialog-header,
  .dialog-body,
  .dialog-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .dialog-footer {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
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
            <h2 id="dialog-title" class="dialog-title">Settings</h2>
            <button
              class="close-button"
              @click="handleClose"
              aria-label="Close settings dialog"
              type="button"
            >
              <CloseIcon/>
            </button>
          </header>
          <div class="dialog-body">
            <div
              v-if="usingExtension"
              class="info-text info-text--success"
              role="status"
              aria-live="polite"
            >
              <CheckIcon/>
              <span>The <a :href="YTC_BRIDGE_GITHUB_URL" target="_blank" rel="noopener noreferrer">ytc-bridge</a> extension is active. You don't need to configure a proxy.</span>
            </div>
            <div
              v-else-if="showInfoText"
              class="info-text info-text--info"
              role="alert"
            >
              <InfoIcon class="info-icon"/>
              <span>To use this application, please configure a proxy server or install the
              <a :href="YTC_BRIDGE_GITHUB_URL" target="_blank" rel="noopener noreferrer">ytc-bridge</a>
              browser extension (recommended).</span>
            </div>
            <form @submit.prevent="handleSave" class="settings-form">
              <div class="form-group">
                <label for="proxy-protocol" class="form-label">Protocol</label>
                <div class="select-wrapper">
                  <select
                    id="proxy-protocol"
                    v-model="localSettings.protocol"
                    :disabled="usingExtension"
                    class="form-select"
                    aria-describedby="protocol-help"
                  >
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                  </select>
                  <ArrowDownIcon class="select-icon"/>
                </div>
              </div>
              <div class="form-group">
                <label for="proxy-host" class="form-label">Host</label>
                <input
                  type="text"
                  id="proxy-host"
                  v-model.trim="localSettings.host"
                  placeholder="e.g., localhost"
                  :disabled="usingExtension"
                  class="form-input"
                  :class="{ 'form-input--error': hostError }"
                  aria-describedby="host-help host-error"
                  @blur="validateHost"
                >
                <div v-if="hostError" id="host-error" class="form-error" role="alert">
                  {{ hostError }}
                </div>
              </div>
              <div class="form-group">
                <label for="proxy-port" class="form-label">Port</label>
                <input
                  type="number"
                  id="proxy-port"
                  v-model.number="localSettings.port"
                  placeholder="e.g., 8080"
                  :disabled="usingExtension"
                  class="form-input"
                  :class="{ 'form-input--error': portError }"
                  aria-describedby="port-help port-error"
                  min="1"
                  max="65535"
                  @blur="validatePort"
                >
                <div v-if="portError" id="port-error" class="form-error" role="alert">
                  {{ portError }}
                </div>
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
              @click="handleSave"
              :disabled="usingExtension || !isFormValid || isSaving"
              type="button"
            >
              <span v-if="isSaving" class="button-spinner"></span>
              {{ isSaving ? 'Saving...' : 'Save & Reload' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { useProxySettings } from '@/composables/useProxySettings';
import { checkExtension, type ProxySettings } from '@/utils/helpers';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const YTC_BRIDGE_GITHUB_URL = 'https://github.com/LuanRT/ytc-bridge';

const visible = ref(true);
const showInfoText = ref(false);
const usingExtension = ref(false);
const isSaving = ref(false);
const dialogRef = ref<HTMLElement>();
const hostError = ref('');
const portError = ref('');

const emit = defineEmits<{
  close: [];
  save: [ settings: ProxySettings ];
}>();

const { isProxyConfigured, settings } = useProxySettings();

const localSettings = ref<ProxySettings>({ ...settings });

const isFormValid = computed(() => {
  const port = localSettings.value.port;
  const isPortValid = port === '' || (Number(port) > 0 && Number(port) <= 65535);

  return localSettings.value.host.trim() !== '' &&
    isPortValid &&
    !hostError.value &&
    !portError.value;
});

function validateHost() {
  const host = localSettings.value.host.trim();
  if (!host) {
    hostError.value = 'Host is required';
    return;
  }

  const hostnameRegex = /^[a-zA-Z0-9.-]+$/;
  if (!hostnameRegex.test(host)) {
    hostError.value = 'Invalid hostname format';
    return;
  }

  hostError.value = '';
}

function validatePort() {
  const port = localSettings.value.port;
  if (port === '' || port === null) {
    portError.value = '';
    return;
  }

  const portNumber = Number(port);
  if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    portError.value = 'Port must be between 1 and 65535';
    return;
  }

  portError.value = '';
}

function handleClose() {
  visible.value = false;
}

function onAfterLeave() {
  emit('close');
}

async function handleSave() {
  validateHost();
  validatePort();
  if (!isFormValid.value) return;

  isSaving.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    emit('save', localSettings.value);
    handleClose();
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    isSaving.value = false;
  }
}

onMounted(async () => {
  usingExtension.value = checkExtension();
  showInfoText.value = !isProxyConfigured.value && !usingExtension.value;

  await nextTick();
  dialogRef.value?.focus();
});
</script>