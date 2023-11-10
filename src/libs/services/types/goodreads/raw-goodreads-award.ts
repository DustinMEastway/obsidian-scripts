import { RawGoodreadsAwardDesignation } from './raw-goodreads-award-designation';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsAward = {
  __typename: RawGoodreadsType.award;
  awardedAt: number;
  category: string;
  designation: RawGoodreadsAwardDesignation;
  name: string;
  webUrl: string;
}
