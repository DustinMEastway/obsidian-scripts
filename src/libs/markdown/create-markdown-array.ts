import { NoteFolder } from '@/obsidian';
import { createMarkdownLink } from './create-markdown-link';

export type CreateMarkdownArrayConfig = {
  /** Whether this array is in YAML or not @default true. */
  inYaml?: boolean;
  /** Number of tabs (two spaces) to use @default 1 if @see inYaml otherwise 0. */
  indentation?: number;
  linkDirectory?: null | NoteFolder;
  prefix?: string;
  suffix?: string;
}

export function createMarkdownArray(
  items: string[] | null | undefined,
  {
    inYaml = true,
    indentation,
    linkDirectory = null,
    prefix = '',
    suffix = ''
  }: CreateMarkdownArrayConfig = {}
): string {
  if (!items?.length) {
    return (inYaml) ? 'null' : '';
  }

  const spaces = '  '.repeat(indentation ?? ((inYaml) ? 1 : 0));
  return items.map((item) => {
    item = item.trim();
    if (linkDirectory != null) {
      item = createMarkdownLink(linkDirectory, item, {
        inYaml
      });
    }

    return `\n${spaces}- ${prefix}${item}${suffix}`;
  }).sort().join('');
}
