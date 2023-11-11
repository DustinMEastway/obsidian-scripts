import { getApolloRefFactory } from '@/apollo';
import { formatDate } from '@/date';
import { removeHtmlTags } from '@/html';
import {
  createMarkdownArray,
  createMarkdownLink
} from '@/markdown';
import { convertRating } from '@/number';
import { createError } from '@/obsidian';
import { getAllMatches } from '@/string';
import { HttpService } from './http-service';
import {
  GoodreadsAuthor,
  GoodreadsBook,
  GoodreadsBookSeries,
  RawGoodreadsBook,
  RawGoodreadsBookSeriesBooks,
  RawGoodreadsBookSeriesData,
  RawGoodreadsBookSeriesDescription,
  RawGoodreadsBookSeriesNumWorks,
  RawGoodreadsContributorRole,
  RawGoodreadsNextData,
  RawGoodreadsType
} from './types';

const searches = {
  authorCover: /<meta\b[^>]*?\bitemprop="image"[^>]*?\bcontent="([^"]+)">/,
  authorDescription: /<span id="freeText[^"]*author[\s\S]*?<\/span>/,
  authorId: /goodreads\.com\/author\/show\/(\d+\.[^?]+)/,
  authorSeries: /<div class="seriesDesc"[^>]*>\s*(<span itemprop='name'[\s\S]*?<\/span>)\s*(<span class="bookMeta">[\s\S]*?<\/span>)/g,
  authorTitle: /<h1\b[\s\S]*?\bclass="authorName"[\s\S]*?<\/h1>/,
  seriesData: /\bdata-react-props="([\s\S]*?)"/g
}

export class GoodreadsService {
  constructor(
    private _httpService: HttpService
  ) {
    // Intentionally left blank.
  }

  static createService(): GoodreadsService {
    return new GoodreadsService(
      new HttpService()
    );
  }

  async getAuthor(url: string): Promise<GoodreadsAuthor> {
    const authorId = searches.authorId.exec(url)?.[1];
    if (!authorId) {
      throw createError(`Unable to find author ID in URL '${url}'.`);
    }

    url = `https://www.goodreads.com/author/show/${authorId}`;
    const [
      mainContent,
      seriesListContent
    ] = await Promise.all([
      this._httpService.fetch({ url }),
      this._httpService.fetch({
        url: `https://www.goodreads.com/series/list?id=${authorId}`
      })
    ]);
    const cover = searches.authorCover.exec(mainContent)?.[1] ?? '';
    const description = removeHtmlTags(searches.authorDescription.exec(mainContent)?.[0] ?? '');
    const series = getAllMatches(searches.authorSeries, seriesListContent).map(([
      _,
      seriesName
    ]) => {
      return removeHtmlTags(seriesName);
    });
    const title = removeHtmlTags(searches.authorTitle.exec(mainContent)?.[0] ?? '');

    return {
      cover,
      description,
      seriesLinks: createMarkdownArray(
        series,
        { linkDirectory: 'Database/Meta/BookSeries' }
      ),
      title,
      url
    };
  }

  async getBook(url: string): Promise<GoodreadsBook> {
    const content = await this._httpService.fetch({ url });
    const nextData = JSON.parse((
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/.exec(content)
    )?.[1] ?? '{}') as RawGoodreadsNextData;
    const { apolloState } = nextData.props.pageProps;
    const bookId = nextData.query.book_id;
    if (!bookId) {
      throw createError('Book ID is missing.');
    }

    const getApolloRef = getApolloRefFactory(apolloState);
    const rawBook = Object.values(apolloState).find((entity) => {
      return (
        entity.__typename === RawGoodreadsType.book
        && entity.webUrl.endsWith(bookId)
      );
    }) as RawGoodreadsBook;

    const authors = [
      rawBook.primaryContributorEdge,
      ...rawBook.secondaryContributorEdges
    ].filter((contributor) => {
      return contributor.role === RawGoodreadsContributorRole.author;
    }).map((contributor) => {
      return getApolloRef(contributor.node).name ?? '';
    });
    const genres = rawBook.bookGenres.map((genre) => {
      return genre.genre.name;
    });
    const isFiction = genres.some((genre) => genre === 'Fiction');
    const charactersDirectory = (
      `Database/Character/${(isFiction) ? 'Fiction' : 'Nonfiction'}`
    );
    const seriesLinks = rawBook.bookSeries.map((series) => {
      const { title } = getApolloRef(series.series);
      return createMarkdownLink(
        'Database/Meta/BookSeries',
        title,
        `${title} (Book ${series.userPosition})`
      );
    });
    const work = getApolloRef(rawBook.work);
    const characters = work.details.characters.map((character) => {
      return character.name;
    });

    return {
      authorLinks: createMarkdownArray(
        authors,
        { linkDirectory: 'Database/Meta/Author' }
      ),
      characterLinks: createMarkdownArray(
        characters,
        { linkDirectory: charactersDirectory }
      ),
      cover: rawBook.imageUrl,
      description: removeHtmlTags(rawBook.description),
      genreLinks: createMarkdownArray(
        genres,
        { linkDirectory: 'Database/Meta/Genre' }
      ),
      pageCount: rawBook.details.numPages,
      publishedOn: formatDate(work.details.publicationTime),
      ratingsGoodreads: this._convertRating(work.stats.averageRating),
      seriesLinks: createMarkdownArray(
        seriesLinks
      ),
      title: rawBook.title,
      url
    };
  }

  async getBookSeries(url: string): Promise<GoodreadsBookSeries> {
    const content = await this._httpService.fetch({ url });
    const seriesData = getAllMatches(searches.seriesData, content).map(([
      _,
      stringData
    ]) => {
      return JSON.parse(
        stringData.replace(/&quot;/g, '"')
      ) as RawGoodreadsBookSeriesData;
    });
    const {
      description,
      title
    } = seriesData.find(RawGoodreadsBookSeriesDescription.is) ?? {};
    const {
      numWorks
    } = seriesData.find(RawGoodreadsBookSeriesNumWorks.is) ?? {};
    const booksData = seriesData.filter(
      RawGoodreadsBookSeriesBooks.is
    );
    const books = booksData.map(({
      series,
      seriesHeaders
    }) => {
      return series.map((
        { book: { bookTitleBare: bookTitle } },
        index
      ) => {
        bookTitle = removeHtmlTags(bookTitle);
        const bookAlias = `${bookTitle} (${seriesHeaders[index]})`;

        return `## ${bookAlias}\n![[Database/Text/Book/${bookTitle}]]`;
      }).join('\n');
    }).join('\n');

    return {
      authorLinks: createMarkdownArray(
        [booksData[0].series[0].book.author.name],
        { linkDirectory: 'Database/Meta/Author' }
      ),
      bookCount: numWorks ?? 0,
      books,
      description: removeHtmlTags(description?.html ?? ''),
      title: title ?? '',
      url
    };
  }

  private _convertRating(rating: null | number): null | number {
    return convertRating({
      maxValue: 5,
      minValue: 1,
      value: rating
    });
  }
}
