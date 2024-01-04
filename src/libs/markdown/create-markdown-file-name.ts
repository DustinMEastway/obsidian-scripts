import { removeHtmlTags } from '@/html';

const invalidCharacterSearch = /[\\,#%&\{\}\/*<>$\'\":@\|]*/g;
const multiSpaceSearch = /\s\s+/g;

export function createMarkdownFileName(fileName: string): string {
  return removeHtmlTags(fileName).replace(
    invalidCharacterSearch,
    ''
  ).replace(
    multiSpaceSearch,
    ' '
  );
}
