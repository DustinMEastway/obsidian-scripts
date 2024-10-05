const tagsSearch = /<!--(?:[\s\S]*?)-->|<([0-9a-zA-Z]+\b)[\s\S]*?>([\s\S]*?)<\/\1>/g;
const characterMap = new Map([
  [/&(#39|#x27|apos);/g, '\''],
  [/&(#8217|lsquo|rsquo);/g, '\''],
  [/&(#822[01]|ldquo|rdquo);/g, '"'],
  [/&amp;/g, '&'],
  [/&gt;/g, '\\>'],
  [/&lt;/g, '\\<'],
  [/\u200B/g, ''],
  [/\u00A0|&nbsp;/g, ' '],
  [/\u000d/g, '\n'],
  // Escape pound signs.
  [/(\s+)(#\w+\b)/g, '$1\\$2'],
  // Whitespace cleanup.
  [/\n(\s*\n){2,}/g, '\n\n'],
  [/^[ \t]+|[ \t]+$/gm, '']
]);

export function removeHtmlTags(html: string): string {
  html = html.replace(/<br\b[\s\S]*?\/>/g, '\n');
  while (tagsSearch.test(html)) {
    html = html.replace(tagsSearch, '$2');
  }
  Array.from(characterMap.entries()).forEach(([find, replace]) => {
    html = html.replace(find, replace);
  });
  return html.trim();
}
