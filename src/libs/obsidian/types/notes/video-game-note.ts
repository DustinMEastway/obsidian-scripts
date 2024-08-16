import { ObsidianPageLink } from '@/types';
import { BaseWebTaskNote } from './base-web-task-note';
import { NoteClass } from './note-class';

export type VideoGameNote = (
  BaseWebTaskNote
  & {
    class: NoteClass.videoGame;
    console: ObsidianPageLink[];
    cover: string;
    developer: ObsidianPageLink[];
    engine: ObsidianPageLink[];
    genre: ObsidianPageLink[];
    next: ObsidianPageLink;
    own: boolean;
    prior: ObsidianPageLink;
    publisher: ObsidianPageLink[];
    ratingsIgdb: number | null;
    remake: ObsidianPageLink[];
    remaster: ObsidianPageLink[];
    runtimeInMinutes: number | null;
    series: ObsidianPageLink[];
    similarGame: ObsidianPageLink[];
    type: ObsidianPageLink[];
  }
);
