import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsBookDetails = {
  __typename: RawGoodreadsType.bookDetails;
  numPages: number;
  publicationTime: number;
};
