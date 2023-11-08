import { HtmlHeader } from '@/html';

export function createMarkdownHeaders(headers: HtmlHeader[]): string {
  return headers.map(({ content, level }) => {
    const headerPrefix = '#'.repeat(level);
    return `${headerPrefix} ${content}`;
  }).join('\n');
}
