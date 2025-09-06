<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  background: rgba(57, 57, 57, 0.67);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  overflow: hidden;
  min-width: 300px;
  max-width: 100%;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  gap: 12px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  line-height: 1.4;
  color: #ffffff;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.toast-dismiss {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #9ca3af;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-dismiss:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #6b7280;
}

.toast-dismiss:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.info {
  border-left: 4px solid #3b82f6;
}

.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

<template>
  <div class="toast-container" aria-live="polite" aria-label="Notifications">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        role="alert"
        :aria-label="toast.message"
      >
        <div class="toast-content">
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-dismiss"
            @click="removeToastNotification(toast.id)"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, watchEffect } from 'vue';
import { useToastStore } from '@/stores/toastStore';

const { toasts, removeToast } = useToastStore();

const timeouts = new Map<number, NodeJS.Timeout>();

function removeToastNotification(id: number) {
  if (timeouts.has(id)) {
    clearTimeout(timeouts.get(id)!);
    timeouts.delete(id);
  }
  removeToast(id);
}

watchEffect(() => {
  toasts.value.forEach((toast) => {
    if (!timeouts.has(toast.id)) {
      const timeout = setTimeout(() => {
        removeToast(toast.id);
        timeouts.delete(toast.id);
      }, toast.duration || 5000);
      timeouts.set(toast.id, timeout);
    }
  });
});

onUnmounted(() => {
  timeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
  timeouts.clear();
});
</script>