import { ref } from 'vue';

export interface Toast {
  id: number
  message: string
  type?: 'error' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToastStore() {
  const addToast = (message: string, type: 'error' | 'info' = 'info', duration = 3000) => {
    const id = nextId++;
    toasts.value.push({ id, message, type, duration });
    return id;
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts,
    addToast,
    removeToast
  };
}