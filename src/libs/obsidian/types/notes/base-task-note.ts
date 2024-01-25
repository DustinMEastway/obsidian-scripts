import { ObsidianPageLink } from '@/types';
import { BaseNote } from './base-note';

export type BaseTaskNote = (
  BaseNote
  & {
    dueOn: ObsidianPageLink;
    priority: ObsidianPageLink;
    status: ObsidianPageLink;
  }
);
