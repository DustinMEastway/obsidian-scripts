import { getApolloRefFactory } from '@/apollo';
import { DateFormat } from '@/date';
import { removeHtmlTags } from '@/html';
import {
  averageMarkdownNumber,
  combineMarkdownArray,
  convertRating,
  createDateLink,
  createMarkdownArray,
  createMarkdownFileName,
  createMarkdownLink,
  sumMarkdownNumber
} from '@/markdown';
import { pick } from '@/object';
import { NoteFolder, createError } from '@/obsidian';
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
  seriesData: /\bdata-react-props="([\s\S]*?)"/g,
  singleBook: /^Book \d+(\.\d+)?$/
};

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
    const cover = searches.authorCover.exec(mainContent)?.[1] ?? 'null';
    const description = removeHtmlTags(searches.authorDescription.exec(mainContent)?.[0] ?? '');
    const series = getAllMatches(searches.authorSeries, seriesListContent).map(([
      _,
      seriesName
    ]) => {
      return createMarkdownFileName(seriesName);
    });
    const title = createMarkdownFileName(searches.authorTitle.exec(mainContent)?.[0] ?? '');

    return {
      cover,
      description: (description) ? `\n\n${description}` : '',
      seriesLinks: createMarkdownArray(
        series,
        { linkDirectory: NoteFolder.bookSeries }
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
    const charactersDirectory = (isFiction) ? (
      NoteFolder.characterFiction
    ) : NoteFolder.characterNonfiction;
    const seriesLinks = rawBook.bookSeries.map((series) => {
      const { title } = getApolloRef(series.series);
      return createMarkdownLink(
        NoteFolder.bookSeries,
        createMarkdownFileName(title),
        { alias: `${title} (Book ${series.userPosition})` }
      );
    });
    const work = getApolloRef(rawBook.work);
    const characters = (work.details?.characters ?? []).map((character) => {
      return character.name;
    });
    const description = removeHtmlTags(rawBook.description);

    return {
      authorLinks: createMarkdownArray(
        authors,
        { linkDirectory: NoteFolder.author }
      ),
      characterLinks: createMarkdownArray(
        characters,
        { linkDirectory: charactersDirectory }
      ),
      cover: rawBook.imageUrl,
      description: (description) ? `\n\n${description}` : '',
      genreLinks: createMarkdownArray(
        genres,
        { linkDirectory: NoteFolder.genre }
      ),
      pageCount: rawBook.details?.numPages ?? 'null',
      publishedOn: (!work.details) ? 'null' : (
        createDateLink(
          work.details.publicationTime,
          { format: DateFormat.datetime }
        )
      ),
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
      description: rawDescription,
      title
    } = seriesData.find(RawGoodreadsBookSeriesDescription.is) ?? {};
    const description = removeHtmlTags(rawDescription?.html ?? '');
    const books = await Promise.all(
      seriesData.filter(
        RawGoodreadsBookSeriesBooks.is
      ).flatMap(({
        series,
        seriesHeaders
      }) => {
        return series.map(({ book: { bookUrl } }, index) => {
          const labelInSeries = seriesHeaders[index];
          return { bookUrl, labelInSeries };
        }).filter(({ labelInSeries }) => {
          return searches.singleBook.test(labelInSeries);
        }).map(async ({
          bookUrl,
          labelInSeries
        }) => {
          const book = await this.getBook(`https://www.goodreads.com/${bookUrl}`);
          const bookTitle = createMarkdownFileName(book.title);
          const alias = `${bookTitle} (${labelInSeries})`;

          return {
            ...pick(book, [
              'authorLinks',
              'characterLinks',
              'cover',
              'genreLinks',
              'pageCount',
              'publishedOn',
              'ratingsGoodreads'
            ]),
            header: `## ${alias}\n\n![[${NoteFolder.book}/${bookTitle}#Description]]`,
            labelInSeries
          };
        });
      })
    );

    const bookHeaders = books.map(({ header }) => {
      return header;
    }).join('\n\n');

    const firstBook = books.find(({ labelInSeries }) => {
      return labelInSeries === 'Book 1';
    }) ?? books[0];
    const ratingsGoodreads = averageMarkdownNumber(books, { key: 'ratingsGoodreads' });

    return {
      authorLinks: combineMarkdownArray(books, { key: 'authorLinks' }),
      characterLinks: combineMarkdownArray(books, { key: 'characterLinks' }),
      bookCount: books.length,
      books: (bookHeaders) ? `\n\n${bookHeaders}` : '',
      cover: firstBook?.cover ?? 'null',
      description: (description) ? `\n\n${description}`: '',
      genreLinks: combineMarkdownArray(books, { key: 'genreLinks' }),
      pageCount: sumMarkdownNumber(books, { key: 'pageCount' }),
      publishedOn: books.map((book) => {
        return book.publishedOn;
      }).sort()[0] ?? 'null',
      ratingsGoodreads: (ratingsGoodreads === 'null') ? ratingsGoodreads : (
        Math.floor(ratingsGoodreads)
      ),
      title: title ?? '',
      url
    };
  }

  private _convertRating(rating: null | number): number | 'null' {
    return convertRating({
      maxValue: 5,
      minValue: 1,
      value: rating
    });
  }
}
