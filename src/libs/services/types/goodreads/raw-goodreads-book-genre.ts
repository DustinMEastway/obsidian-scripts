import { RawGoodreadsGenre } from './raw-goodreads-genre';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsBookGenre = {
  __typename: RawGoodreadsType.bookGenre;
  genre: RawGoodreadsGenre;
};
