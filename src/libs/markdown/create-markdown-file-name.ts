const invalidCharacterSearch = /[\\,#%&\{\}\/*<>$\'\":@]*/g;

export function createMarkdownFileName(fileName: string): string {
  return fileName.replace(
    invalidCharacterSearch,
    ''
  );
}
