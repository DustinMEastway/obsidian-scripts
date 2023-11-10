import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsGenre = {
  __typename: RawGoodreadsType.genre;
  name: string;
  webUrl: string;
};
