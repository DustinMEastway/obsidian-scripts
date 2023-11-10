import { RawGoodreadsBook } from './raw-goodreads-book';
import { RawGoodreadsContributor } from './raw-goodreads-contributor';
import { RawGoodreadsReview } from './raw-goodreads-review';
import { RawGoodreadsSeries } from './raw-goodreads-series';
import { RawGoodreadsShelving } from './raw-goodreads-shelving';
import { RawGoodreadsUser } from './raw-goodreads-user';
import { RawGoodreadsWork } from './raw-goodreads-work';

export type RawGoodreadsApolloState = Record<
  string,
  (
    RawGoodreadsBook
    | RawGoodreadsContributor
    | RawGoodreadsReview
    | RawGoodreadsSeries
    | RawGoodreadsShelving
    | RawGoodreadsUser
    | RawGoodreadsWork
  )
>;
