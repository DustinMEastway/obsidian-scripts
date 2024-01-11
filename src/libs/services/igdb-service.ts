import { formatDate } from '@/date';
import {
  createMarkdownArray,
  createMarkdownFileName
} from '@/markdown';
import { NoteFolder } from '@/obsidian';
import { camelCaseObject } from '@/object';
import { HttpService } from './http-service';
import { TwitchService, TwitchServiceConfig } from './twitch-service';
import {
  HttpRequestMethod,
  IgdbGame,
  IgdbSearchGame,
  RawIgdbGame,
  RawIgdbSearchGame
} from './types';
import { TimeInMs } from '@/number';

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
          return name;
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
        involvedCompanies.filter(({ developer }) => {
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
        involvedCompanies.filter(({ publisher }) => {
          return publisher;
        }).map(({ company }) => {
          return company;
        }),
        NoteFolder.company
      ),
      ratingsIgdb: Math.round(totalRating),
      releaseDate: formatDate(this._convertDate(firstReleaseDate)),
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
