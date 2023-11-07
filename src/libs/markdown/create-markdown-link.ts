export function createMarkdownLink(
  directory: null | string,
  item: string
): string {
  directory = (!directory?.endsWith('/')) ? (
    `${directory}/`
  ) : directory;

  return `"[[${directory}${item}|${item}]]"`;
}
