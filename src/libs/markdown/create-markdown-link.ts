import { NoteFolder } from '@/obsidian';
import { createMarkdownFileName } from './create-markdown-file-name';

export type CreateMarkdownLinkConfig = {
  /** Alias of the link @default @see item. */
  alias?: string;
  /** Add quotes to links in Yaml @default true */
  inYaml?: boolean;
}

export function createMarkdownLink(
  folder: null | NoteFolder,
  item: string,
  {
    alias,
    inYaml = true
  }: CreateMarkdownLinkConfig = {}
): string {
  item = createMarkdownFileName(item);
  const directory = (!folder?.endsWith('/')) ? (
    `${folder}/`
  ) : folder;
  const link = `[[${directory}${item}|${alias ?? item}]]`;

  return (inYaml) ? `"${link}"` : link;
}
