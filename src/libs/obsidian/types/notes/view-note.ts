import { BaseNote } from './base-note';
import { NoteClass } from './note-class';

export type ViewNote = (
  BaseNote
  & {
    class: NoteClass.view;
    description: string;
    order: number;
  }
);
