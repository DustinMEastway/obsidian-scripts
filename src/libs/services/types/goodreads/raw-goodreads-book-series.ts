import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsSeries } from './raw-goodreads-series';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsBookSeries = {
  __typename: RawGoodreadsType.bookSeries;
  series: (
    RawGoodreadsSeries
    | RawGoodreadsEntityRef<'Series'>
  );
  userPosition: string;
};
