import { StringCase } from './types';

export function convertCase(
  value: string,
  convertType: StringCase
): string {
  const valueArray = (
    value
      // Seperates words based placing of capitals, spaces, and numbers.
      .replace(
        /[^a-zA-Z0-9\n]|([a-z])(?=[A-Z])|(\D)(?=\d)|(\d)(?=\D)/g,
        '$1$2$3 '
      )
      .trim()
      .toLowerCase()
      .split(/\s+/)
  );
  switch (convertType) {
    case StringCase.camel: {
      const words = titleCaseWords(valueArray);
      return [words[0]?.toLowerCase(), ...words.slice(1)].join('');
    }
    case StringCase.kebab:
      return valueArray.join('-');
    case StringCase.pascal:
      return titleCaseWords(valueArray).join('');
    case StringCase.snake:
      return valueArray.join('_');
    case StringCase.title:
      return titleCaseWords(valueArray).join(' ');
    default: {
      const invalidType: never = convertType;
      throw new Error(`incorrect case type '${invalidType}'`);
    }
  }
}

/**
 * Capitalize the first letter of each word.
 *
 * @warning It is assumed that words are all lower cased.
 */
function titleCaseWords(words: string[]): string[] {
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
}
