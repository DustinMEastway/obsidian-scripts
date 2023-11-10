import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsType } from './raw-goodreads-type';
import { RawGoodreadsUser } from './raw-goodreads-user';

export type RawGoodreadsContributor = {
  __typename: RawGoodreadsType.contributor;
  id: string;
  works: {
    __typename: RawGoodreadsType.contributorWorksConnection;
    totalCount: number;
  };
} & (
  {
    description: string;
    followers: {
      __typename: RawGoodreadsType.contributorFollowersConnection;
      totalCount: number;
    };
    isGrAuthor: boolean;
    legacyId: number;
    name: string;
    profileImageUrl: string;
    user: (
      RawGoodreadsUser
      | RawGoodreadsEntityRef<'User'>
    );
    viewerIsFollowing: null;
    webUrl: string;
  } | {
    description?: never;
    followers?: never;
    isGrAuthor?: boolean;
    legacyId?: never;
    name?: string;
    profileImageUrl?: never;
    user?: never;
    viewerIsFollowing?: never;
    webUrl?: never;
  }
);
