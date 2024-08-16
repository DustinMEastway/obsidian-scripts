import { RawGoodreadsBookContributorEdge } from './raw-goodreads-book-contributor-edge';
import { RawGoodreadsBookDetails } from './raw-goodreads-book-details';
import { RawGoodreadsBookGenre } from './raw-goodreads-book-genre';
import { RawGoodreadsBookSeries } from './raw-goodreads-book-series';
import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsShelving } from './raw-goodreads-shelving';
import { RawGoodreadsType } from './raw-goodreads-type';
import { RawGoodreadsWork } from './raw-goodreads-work';

export type RawGoodreadsBook = {
  __typename: RawGoodreadsType.book;
  bookGenres: RawGoodreadsBookGenre[];
  bookSeries: RawGoodreadsBookSeries[];
  description: string;
  details: RawGoodreadsBookDetails | null;
  id: string;
  imageUrl: string;
  legacyId: number;
  primaryContributorEdge: RawGoodreadsBookContributorEdge;
  secondaryContributorEdges: RawGoodreadsBookContributorEdge[];
  title: string;
  titleComplete: string;
  viewerShelving: (
    null
    | RawGoodreadsShelving
    | RawGoodreadsEntityRef<'Shelving'>
  );
  webUrl: string;
  work: (
    RawGoodreadsWork
    | RawGoodreadsEntityRef<'Work'>
  );
};
