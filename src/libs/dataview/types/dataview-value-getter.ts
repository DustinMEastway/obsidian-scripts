import { ObsidianPage } from '@/types';

export type DataviewValueGetter<T, R> = (page: ObsidianPage<T>) => R;
