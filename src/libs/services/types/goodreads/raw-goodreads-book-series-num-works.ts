import { RawGoodreadsBookSeriesData } from './raw-goodreads-book-series-data';

export type RawGoodreadsBookSeriesNumWorks = {
  currentPageNumber: number;
  numWorks: number;
  perPage: number;
};

export const RawGoodreadsBookSeriesNumWorks = {
  is(
    data: RawGoodreadsBookSeriesData
  ): data is RawGoodreadsBookSeriesNumWorks {
    return 'numWorks' in data;
  }
};
