import { getHtmlHeaders } from './get-html-headers';
import { HtmlHeader } from './types';

export function getWikipediaHeaders(html: string): HtmlHeader[] {
  const headers = getHtmlHeaders(html);

  if (headers[0].content === 'Contents') {
    headers.splice(0, 1);
  }

  // This header just restates the name of the article.
  if (headers[0].level === 1) {
    headers[0].content = 'Chapters';

    headers.splice(1, 0, {
      content: 'Description',
      level: 2
    });
  }

  headers.forEach((header) => {
    header.content = header.content.replace(/\s*\[edit\]\s*$/, '');
  });

  return headers;
}
