import {
  createMarkdownArray,
  createMarkdownFileName
} from '@/markdown';
import { convertRating } from '@/number';
import { camelCaseObject } from '@/object';
import { NoteFolder, createError } from '@/obsidian';
import { HttpService } from './http-service';
import {
  OmdbSearchItem,
  RawOmdbSearchResponse,
  RawOmdbSearchItem,
  OmdbMediaType,
} from './types';

export class OmdbService {
  constructor(
    private _httpService: HttpService
  ) {
    // Intentionally left blank.
  }

  static createService({
    apiKey,
    apiUrl
  }: {
    apiKey: string;
    apiUrl: string;
  }): OmdbService {
    return new OmdbService(
      new HttpService(
        null,
        [(requestConfig) => {
          requestConfig.url = `${apiUrl}/${requestConfig.url}`;
          requestConfig.query ??= {};
          requestConfig.query.apikey = apiKey;
          return requestConfig;
        }]
      )
    );
  }

  convertTitle({
    title,
    year
  }: RawOmdbSearchItem): string {
    return `${title} (${year})`;
  }

  async getById(id: string): Promise<OmdbSearchItem> {
    const response = await this._httpService.fetchJson<RawOmdbSearchItem>({
      query: { i: id },
      url: ''
    });
    if (!response) {
      throw createError('No results found.');
    }

    return this._convert(response);
  }

  async getByQuery(
    query: string,
    mediaType: OmdbMediaType
  ): Promise<OmdbSearchItem[]> {
    const response = ((
      await this._httpService.fetchJson<RawOmdbSearchResponse>({
        query: { s: query },
        url: ''
      })
    )?.Search ?? []).map((item) => {
      return this._convert(item);
    }).filter((item) => {
      return item.type === mediaType;
    });

    if (!response.length) {
      throw createError('No results found.');
    }

    return response;
  }

  private _convert(item: RawOmdbSearchItem): OmdbSearchItem {
    item = camelCaseObject(item);
    const {
      actors,
      director,
      genre,
      imdbRating,
      plot
    } = item;
    const type = this._convertType(item.type);

    return {
      ...item,
      actorLinks: this._convertArray(actors, NoteFolder.characterNonfiction),
      directorLinks: this._convertArray(director, NoteFolder.characterNonfiction),
      fileName: createMarkdownFileName(
        this.convertTitle(item)
      ),
      genreLinks: this._convertArray(genre, NoteFolder.genre),
      imdbRating: this._convertRating(imdbRating),
      plot: (plot) ? `\n\n${plot}` : '',
      type
    };
  }

  private _convertArray(
    itemsString: string,
    linkDirectory: string
  ): string {
    return createMarkdownArray(
      (itemsString === 'N/A') ? null : itemsString?.split(','),
      { linkDirectory }
    ) ?? '';
  }

  private _convertRating(rating: null | number): null | number {
    return convertRating({
      maxValue: 10,
      minValue: 1,
      value: rating
    });
  }

  private _convertType(type: string): OmdbMediaType {
    switch (type) {
      case 'game':
        return OmdbMediaType.game;
      case 'movie':
        return OmdbMediaType.movie;
      case 'series':
        return OmdbMediaType.show;
    }

    throw createError(`Unknown media type '${type}'.`);
  }
}
