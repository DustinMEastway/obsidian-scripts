export type GoodreadsBook = {
  authorLinks: string | null;
  characterLinks: string | null;
  cover: string;
  description: string;
  genreLinks: string | null;
  pageCount: number | 'null';
  publishedOn: string;
  ratingsGoodreads: number | 'null';
  seriesLinks: string | null;
  title: string;
  url: string;
}
