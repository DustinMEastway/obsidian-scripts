import { OmdbMediaType } from './omdb-media-type';
import { RawOmdbSearchItem } from './raw-omdb-search-item';

type OmittedRawKeys = (
  'type'
);

export type OmdbSearchItem = Omit<RawOmdbSearchItem, OmittedRawKeys> & {
  actorLinks: string;
  directorLinks: string;
  fileName: string;
  genreLinks: string;
  type: OmdbMediaType;
};
