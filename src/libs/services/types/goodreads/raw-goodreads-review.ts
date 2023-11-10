import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsType } from './raw-goodreads-type';
import { RawGoodreadsUser } from './raw-goodreads-user';

export type RawGoodreadsReview = {
  __typename: RawGoodreadsType.review;
  commentCount: number;
  createdAt: number;
  creator: (
    RawGoodreadsUser
    | RawGoodreadsEntityRef<'User'>
  );
  id: string;
  lastRevisionAt: number;
  likeCount: number;
  rating: number;
  recommendFor: null;
  spoilerStatus: boolean;
  text: string;
  updatedAt: number;
  viewerHasLiked: boolean;
};
