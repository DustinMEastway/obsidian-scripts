import {
  createDateLink,
  createMarkdownArray,
  createMarkdownFileName
} from '@/markdown';
import { TimeInMs } from '@/number';
import { camelCaseObject } from '@/object';
import { NoteFolder } from '@/obsidian';
import { HttpService } from './http-service';
import { TwitchService, TwitchServiceConfig } from './twitch-service';
import {
  HttpRequestMethod,
  IgdbGame,
  IgdbGameSeries,
  IgdbSearchGame,
  RawIgdbGame,
  RawIgdbGameSeries,
  RawIgdbSearchGame
} from './types';

export class IgdbService {
  constructor(
    private _httpService: HttpService
  ) {
    // Intentionally left blank.
  }

  static createService(
    config: TwitchServiceConfig
  ): IgdbService {
    const twitchService = TwitchService.createService(config);

    return new IgdbService(
      new HttpService(
        'https://api.igdb.com/v4',
        [async (requestConfig) => {
          const token: string = await twitchService.token;
          requestConfig.headers ??= {};
          requestConfig.headers['Authorization'] = `Bearer ${token}`;
          requestConfig.headers['Client-ID'] = config.clientId;
          return requestConfig;
        }]
      )
    );
  }

  async getGame(id: number): Promise<IgdbGame> {
    const games = camelCaseObject<RawIgdbGame[]>(
      await this._httpService.fetchJson({
        body: `
          fields
            cover.url,
            first_release_date,
            franchises.name,
            game_engines.name,
            genres.name,
            involved_companies.company.name,
            involved_companies.developer,
            involved_companies.publisher,
            name,
            platforms.name,
            remakes.name,
            remakes.first_release_date,
            remasters.name,
            remasters.first_release_date,
            similar_games.name,
            similar_games.first_release_date,
            summary,
            themes.name,
            total_rating,
            url
          ;
          where id=${id};
        `,
        method: HttpRequestMethod.post,
        url: 'games'
      })
    );

    if (games.length !== 1) {
      throw new Error(`ID matched ${games.length} games!`);
    }

    return this._convertGame(games[0]);
  }

  async searchGameSeries(query: string): Promise<IgdbGameSeries[]> {
    return camelCaseObject<RawIgdbGameSeries[]>(
      await this._httpService.fetchJson({
        body: `
          fields
            games.id,
            games.first_release_date,
            games.name,
            name,
            url
          ;
          where name ~ *"${query}"*;
        `,
        method: HttpRequestMethod.post,
        url: 'franchises'
      })
    ).map((gameSeries) => this._convertGameSeries(gameSeries));
  }

  async searchGames(query: string): Promise<IgdbSearchGame[]> {
    return camelCaseObject<RawIgdbSearchGame[]>(
      await this._httpService.fetchJson({
        body: `
          fields
            id,
            first_release_date,
            name
          ;
          search "${query}";
        `,
        method: HttpRequestMethod.post,
        url: 'games'
      })
    ).map((item) => this._convertSearchGame(item));
  }

  private _convertDate(date: number): Date {
    // Timestamps are in seconds and off by one day.
    return new Date(date * 1000 + TimeInMs.days);
  }

  private _convertGame(
    item: RawIgdbGame
  ): IgdbGame {
    const {
      cover: {
        url: cover
      },
      firstReleaseDate,
      franchises,
      gameEngines,
      genres,
      involvedCompanies,
      platforms,
      remakes,
      remasters,
      similarGames,
      summary: description,
      themes,
      totalRating,
      url
    } = item;

    const createNameArray = (
      items: { name: string; }[],
      linkDirectory: NoteFolder
    ): string => {
      return createMarkdownArray(
        items?.map(({ name }) => {
          return createMarkdownFileName(name);
        }),
        { linkDirectory }
      );
    };
    const createGameArray = (
      games: RawIgdbSearchGame[]
    ): string => {
      return createNameArray(
        games?.map((game) => {
          return {
            name: this._convertSearchGame(game).fileName
          };
        }),
        NoteFolder.videoGame
      );
    };

    return {
      ...this._convertSearchGame(item),
      consoleLinks: createNameArray(
        platforms,
        NoteFolder.videoGameConsole
      ),
      cover: `https:${cover}`.replace('t_thumb', 't_cover_big'),
      description: (description) ? `\n\n${description}` : '',
      developerLinks: createNameArray(
        involvedCompanies?.filter(({ developer }) => {
          return developer;
        }).map(({ company }) => {
          return company;
        }),
        NoteFolder.company
      ),
      engineLinks: createNameArray(
        gameEngines,
        NoteFolder.videoGameEngine
      ),
      genreLinks: createNameArray(
        themes,
        NoteFolder.genre
      ),
      publisherLinks: createNameArray(
        involvedCompanies?.filter(({ publisher }) => {
          return publisher;
        }).map(({ company }) => {
          return company;
        }),
        NoteFolder.company
      ),
      ratingsIgdb: (totalRating) ? Math.round(totalRating) : 'null',
      releaseDate: createDateLink(this._convertDate(firstReleaseDate)),
      remakeLinks: createGameArray(remakes),
      remasterLinks: createGameArray(remasters),
      seriesLinks: createNameArray(
        franchises,
        NoteFolder.videoGameSeries
      ),
      similarGameLinks: createGameArray(similarGames),
      typeLinks: createNameArray(
        genres,
        NoteFolder.videoGameType
      ),
      url
    }
  }

  private _convertGameSeries(
    gameSeries: RawIgdbGameSeries
  ): IgdbGameSeries {
    const {
      games,
      name,
      url
    } = gameSeries;

    return {
      fileName: createMarkdownFileName(name),
      gameLinks: (!games?.length) ? '' : (
        '\n\n' + games.map((game) => {
          const { fileName } = this._convertSearchGame(game);
          return `## ${fileName}\n\n![[${NoteFolder.videoGame}/${fileName}]]`;
        }).join('\n\n')
      ),
      url
    }
  }

  private _convertSearchGame(
    item: RawIgdbSearchGame
  ): IgdbSearchGame {
      const { firstReleaseDate, id, name } = item;
      const year = this._convertDate(firstReleaseDate).getFullYear();

      return {
        fileName: createMarkdownFileName(`${name} (${year})`),
        id,
      };
  }
}
