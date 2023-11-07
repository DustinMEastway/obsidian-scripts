import { createMarkdownLink } from './create-markdown-link';

export type CreateMarkdownArrayConfig = {
  indentation?: number;
  linkDirectory?: null | string;
  prefix?: string;
  suffix?: string;
}

export function createMarkdownArray(
  items: string[],
  {
    indentation = 1,
    linkDirectory = null,
    prefix = '',
    suffix = ''
  }: CreateMarkdownArrayConfig = {}
): null | string {
  if (!(items instanceof Array)) {
    return null;
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
