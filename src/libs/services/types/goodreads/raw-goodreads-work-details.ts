import { RawGoodreadsCharacter } from './raw-goodreads-character';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsWorkDetails = {
  __typename: RawGoodreadsType.bookDetails;
  awardsWon: never[];
  characters: RawGoodreadsCharacter[];
  originalTitle: string;
  places: string[];
  publicationTime: number;
  shelvesUrl: string;
  webUrl: string;
};
