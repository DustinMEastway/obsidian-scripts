export type RawFreeDictionaryResponse = {
  phonetic: string;
  phonetics: {
    audio: string;
    license?: {
      name: string;
      url: string;
    };
    sourceUrl: string;
    text: string;
  }[];
  license: {
    name: string;
    url: string;
  };
  meanings: {
    antonyms: string[];
    definitions: {
      antonyms: string[];
      definition: string;
      example?: string;
      synonyms: string[];
    }[];
    partOfSpeech: string;
    synonyms: string[];
  }[];
  sourceUrls: string[];
  word: string;
}[];
