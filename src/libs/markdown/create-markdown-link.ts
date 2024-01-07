import { NoteFolder } from '@/obsidian';

export function createMarkdownLink(
  folder: null | NoteFolder,
  item: string,
  itemAlias?: string
): string {
  const directory = (!folder?.endsWith('/')) ? (
    `${folder}/`
  ) : folder;

  return `"[[${directory}${item}|${itemAlias ?? item}]]"`;
}
