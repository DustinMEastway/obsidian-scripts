import { RawGoodreadsBookSeriesData } from './raw-goodreads-book-series-data';

export type RawGoodreadsBookSeriesDescription = {
  description: {
    html: string;
    truncatedHtml: string;
  };
  subtitle: string;
  title: string;
};

export const RawGoodreadsBookSeriesDescription = {
  is(
    data: RawGoodreadsBookSeriesData
  ): data is RawGoodreadsBookSeriesDescription {
    return 'description' in data;
  }
};
