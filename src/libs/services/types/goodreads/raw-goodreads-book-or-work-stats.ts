import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsBookOrWorkStats = {
  __typename: RawGoodreadsType.bookOrWorkStats;
  /** Rating range from 1-5. */
  averageRating: number;
  ratingsCount: number;
};
