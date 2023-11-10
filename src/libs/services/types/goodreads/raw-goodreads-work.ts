import { RawGoodreadsBook } from './raw-goodreads-book';
import { RawGoodreadsBookOrWorkStats } from './raw-goodreads-book-or-work-stats';
import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsResourceQuotesConnection } from './raw-goodreads-resource-quotes-connection';
import { RawGoodreadsType } from './raw-goodreads-type';
import { RawGoodreadsWorkDetails } from './raw-goodreads-work-details';

export type RawGoodreadsWork = {
  __typename: RawGoodreadsType.work;
  bestBook: (
    RawGoodreadsBook
    | RawGoodreadsEntityRef<'Book'>
  );
  choiceAwards: never[];
  details: RawGoodreadsWorkDetails;
  editions: {
    __typename: RawGoodreadsType.booksConnection;
    webUrl: string;
  };
  id: string;
  [`quotes({\"pagination\":{\"limit\":1}})`]: RawGoodreadsResourceQuotesConnection;
  stats: RawGoodreadsBookOrWorkStats;
};
