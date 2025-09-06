import { inject } from 'vue';
import type { Innertube } from 'youtubei.js/web';

export function useInnertube() {
  return inject('innertube') as () => Promise<Innertube>;
}