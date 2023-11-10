import { RawGoodreadsType } from './raw-goodreads-type';

export type RawGoodreadsCharacter = {
  __typename: RawGoodreadsType.character;
  name: string;
  webUrl: string;
}
