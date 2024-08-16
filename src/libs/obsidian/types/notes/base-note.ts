import { ObsidianPageLink } from '@/types';
import { NoteClass } from './note-class';

export type BaseNote = {
  class: NoteClass;
  from: ObsidianPageLink[];
  rating: number;
};
