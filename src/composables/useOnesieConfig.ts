import { inject } from 'vue';
import type { OnesieHotConfig } from '@/utils/helpers';

export function useOnesieConfig() {
  return inject('onesieHotConfig') as () => Promise<OnesieHotConfig>;
}