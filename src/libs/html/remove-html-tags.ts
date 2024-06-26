const tagsSearch = /<!--(?:[\s\S]*?)-->|<([0-9a-zA-Z]+\b)[\s\S]*?>([\s\S]*?)<\/\1>/g;
const characterMap = new Map([
  [/&(#39|#x27|apos);/g, '\''],
  [/&#8217;/g, '\''],
  [/&#822[01];/g, '"'],
  [/&amp;/g, '&'],
  [/&gt;/g, '\\>'],
  [/&lt;/g, '\\<'],
  [/​|&nbsp;/g, ' '],
  // Escape pound signs.
  [/(\s+)(#\w+\b)/g, '$1\\$2']
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
