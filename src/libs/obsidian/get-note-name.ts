import { ObsidianPage } from '@/types';

export function getNoteName(page: ObsidianPage<unknown>): string {
  return page.aliases?.[0] ?? page.file.name;
}
