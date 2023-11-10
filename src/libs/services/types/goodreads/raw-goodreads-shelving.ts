import { RawGoodreadsEntityRef } from './raw-goodreads-entity-ref';
import { RawGoodreadsReview } from './raw-goodreads-review';
import { RawGoodreadsShelf } from './raw-goodreads-shelf';
import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsShelving = {
  __typename: RawGoodreadsType.shelving;
  id?: string;
  review?: (
    null
    | RawGoodreadsReview
    | RawGoodreadsEntityRef<'Review'>
  );
  shelf: (
    RawGoodreadsShelf
    | RawGoodreadsEntityRef<'Shelf'>
  );
  taggings: never[];
  webUrl: string;
};
