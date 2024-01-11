import { NoteFolder } from '@/obsidian';
import { createMarkdownLink } from './create-markdown-link';

export type CreateMarkdownArrayConfig = {
  indentation?: number;
  linkDirectory?: null | NoteFolder;
  prefix?: string;
  suffix?: string;
}

export function createMarkdownArray(
  items: string[] | null | undefined,
  {
    indentation = 1,
    linkDirectory = null,
    prefix = '',
    suffix = ''
  }: CreateMarkdownArrayConfig = {}
): string {
  if (!items?.length) {
    return 'null';
  }

  const spaces = '  '.repeat(indentation);
  return items.map((item) => {
    item = item.trim();
    if (linkDirectory != null) {
      item = createMarkdownLink(linkDirectory, item);
    }

    return `\n${spaces}- ${prefix}${item}${suffix}`;
  }).join('');
}
