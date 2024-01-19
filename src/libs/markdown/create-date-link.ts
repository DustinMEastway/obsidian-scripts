import { FormatDateConfig, formatDate } from '@/date';
import { NoteFolder } from '@/obsidian';
import { createMarkdownLink } from './create-markdown-link';

export function createDateLink(
  date: Date | number | string,
  config: FormatDateConfig = {}
) {
  date = (date instanceof Date) ? date : new Date(date);
  return createMarkdownLink(
    NoteFolder.dailyNote,
    formatDate(date),
    formatDate(date, config)
  );
}