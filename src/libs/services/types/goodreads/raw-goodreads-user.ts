import { RawGoodreadsContributor } from './raw-goodreads-contributor';
import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsUser = {
  __typename: RawGoodreadsType.user;
  contributor: (
    RawGoodreadsContributor
    | RawGoodreadsEntityRef<'Contributor'>
    | null
  );
  followersCount: number;
  id: number;
  imageUrlSquare: string;
  isAuthor: boolean;
  legacyId: number;
  name: string;
  textReviewsCount: number;
  webUrl: string;
};
