/** Part of speech key followed by antonyms & synonyms. */
export type ThesaurusResponse = Record<string, {
  antonyms: string[];
  synonyms: string[];
}>;
