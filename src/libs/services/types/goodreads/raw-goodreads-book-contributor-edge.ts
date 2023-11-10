import { RawGoodreadsContributor } from './raw-goodreads-contributor';
import { RawGoodreadsContributorRole } from './raw-goodreads-contributor-role';
import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsBookContributorEdge = {
  __typename: RawGoodreadsType.bookContributorEdge;
  node: (
    RawGoodreadsContributor
    | RawGoodreadsEntityRef<'Contributor'>
  );
  role: RawGoodreadsContributorRole.author;
};
