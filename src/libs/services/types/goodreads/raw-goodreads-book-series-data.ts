import { RawGoodreadsBookSeriesBooks } from './raw-goodreads-book-series-books';
import { RawGoodreadsBookSeriesDescription } from './raw-goodreads-book-series-description';
import { RawGoodreadsBookSeriesNumWorks } from './raw-goodreads-book-series-num-works';

export type RawGoodreadsBookSeriesData = (
  RawGoodreadsBookSeriesBooks
  | RawGoodreadsBookSeriesDescription
  | RawGoodreadsBookSeriesNumWorks
);
