import { ObsidianPageLink } from './obsidian-page-link';

export type ObsidianFile = {
  aliases: string[];
  folder: string;
  inlinks: ObsidianPageLink[];
  link: ObsidianPageLink;
  name: string;
  outlinks: ObsidianPageLink[];
  path: string;
  tags: string[];
};
