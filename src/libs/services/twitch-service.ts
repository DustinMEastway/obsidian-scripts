import { camelCaseObject } from '@/object';
import { HttpService } from './http-service';
import { HttpRequestMethod } from './types';

export type TwitchServiceConfig = {
  clientId: string;
  clientSecret: string;
}

export class TwitchService {
  private _token: Promise<string>;

  get token(): Promise<string> {
    return this._token;
  }

  constructor(
    private _config: TwitchServiceConfig,
    private _httpService: HttpService
  ) {
    this._token = this._getToken();
  }

  static createService(config: TwitchServiceConfig): TwitchService {
    return new TwitchService(
      config,
      new HttpService('https://id.twitch.tv')
    );
  }

  private async _getToken(): Promise<string> {
    const { clientId, clientSecret } = this._config;
    return camelCaseObject<{ accessToken: string }>(
      await this._httpService.fetchJson({
        body: undefined,
        query: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        },
        method: HttpRequestMethod.post,
        url: 'oauth2/token'
      })
    ).accessToken;
  }
}
