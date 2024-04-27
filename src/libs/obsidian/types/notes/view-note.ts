import { BaseNote } from './base-note';

export type ViewNote = (
  BaseNote
  & {
    order: number;
  }
);