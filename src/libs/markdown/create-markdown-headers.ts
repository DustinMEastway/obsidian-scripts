import {
  HtmlHeader,
  removeHtmlTags
} from '@/html';

export function createMarkdownHeaders(
  headers: HtmlHeader[]
): string {
  return headers.map(({ content, level }) => {
    const headerPrefix = '#'.repeat(level);
    return `\n${headerPrefix} ${removeHtmlTags(content)}`;
  }).join('\n');
}
