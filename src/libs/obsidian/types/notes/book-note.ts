import { ObsidianPageLink } from '@/types';
import { BaseWebTaskNote } from './base-web-task-note';

export type BookNote = (
  BaseWebTaskNote
  & {
    cover: string;
    next: ObsidianPageLink;
    priority: ObsidianPageLink;
    prior: ObsidianPageLink;
    ratingsGoodreads: number;
    status: ObsidianPageLink;
  }
);
