import { ObsidianPageLink } from '@/types';
import { BaseWebTaskNote } from './base-web-task-note';

export type BookNote = (
  BaseWebTaskNote
  & {
    cover: string;
    next: ObsidianPageLink;
    prior: ObsidianPageLink;
    ratingsGoodreads: number;
  }
);
