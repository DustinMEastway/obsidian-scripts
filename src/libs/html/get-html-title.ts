const titleSearch = /<head\b[\s\S]*<title\b[^>]*>(.*?)</;

export function getHtmlTitle(html: string) {
  const title = titleSearch.exec(html)?.[1];
  return (!title) ? null : title;
}
