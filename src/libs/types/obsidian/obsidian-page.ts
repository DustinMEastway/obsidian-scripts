import { ObsidianFile } from './obsidian-file';

export type ObsidianPage<T> = (
  T
  & {
    aliases: string[];
    file: ObsidianFile;
    tags: string[];
  }
);
