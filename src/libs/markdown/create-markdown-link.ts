export function createMarkdownLink(
  directory: null | string,
  item: string,
  itemAlias?: string
): string {
  directory = (!directory?.endsWith('/')) ? (
    `${directory}/`
  ) : directory;

  return `"[[${directory}${item}|${itemAlias ?? item}]]"`;
}
