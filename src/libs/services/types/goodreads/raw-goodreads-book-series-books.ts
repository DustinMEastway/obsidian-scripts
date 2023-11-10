import { RawGoodreadsBookSeriesData } from './raw-goodreads-book-series-data';

export type RawGoodreadsBookSeriesBooks = {
  series: {
    book: {
      author: {
        id: number;
        isGoodreadsAuthor: boolean;
        name: string;
        profileUrl: string;
        worksListUrl: string;
      };
      avgRating: number;
      bookId: string;
      bookTitleBare: string;
      bookUrl: string;
      description: {
        html: string;
        truncatedHtml: string;
      };
      editions: string;
      editionsUrl: string;
      from_search: boolean;
      from_srp: boolean;
      imageUrl: string;
      kcrPreviewUrl: string;
      numPages: number;
      publicationDate: string;
      qid: null;
      rank: null;
      ratingsCount: number;
      textReviewsCount: number;
      title: string;
      toBePublished: boolean;
      workId: string;
    };
    isLibrarianView: boolean;
  }[];
  seriesHeaders: string[];
};

export const RawGoodreadsBookSeriesBooks = {
  is(
    data: RawGoodreadsBookSeriesData
  ): data is RawGoodreadsBookSeriesBooks {
    return 'series' in data;
  }
};
