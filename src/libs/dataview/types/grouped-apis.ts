import { DataviewApi, ObsidianApi } from '@/types';

export type GroupedApis = {
  /** Needed because using dataview's `table` off from @see obsidianApi does not work. */
  dataviewApi: DataviewApi;
  obsidianApi: ObsidianApi;
};
