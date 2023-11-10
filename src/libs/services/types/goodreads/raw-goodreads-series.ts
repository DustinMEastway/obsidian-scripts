import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsSeries = {
  __typename: RawGoodreadsType.series;
  id: string;
  title: string;
  webUrl: string;
};
