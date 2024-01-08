import {
  HtmlHeader,
  removeHtmlTags
} from '@/html';

export function createMarkdownHeaders(
  headers: HtmlHeader[]
): string {
  return headers.map(({
    content,
    level,
    url
  }) => {
    const headerPrefix = '#'.repeat(level);
    let header = `\n${headerPrefix} ${removeHtmlTags(content)}`;
    if (url) {
      header += `\n\n[Link](${url})`;
    }

    return header;
  }).join('\n');
}
