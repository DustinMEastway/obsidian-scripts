import {
  HttpRequest,
  HttpRequestAdapter
} from './types';

export class HttpService {
  constructor(
    private _baseUrl: string | null = null,
    private _adapters: HttpRequestAdapter[] = []
  ) {
    // Intentionally left blank.
  }

  async fetch(
    requestConfig: HttpRequest
  ): Promise<string> {
    const {
      body,
      headers,
      method,
      query,
      url
    } = await this._adaptRequest(requestConfig);
    const urlBuilder = new URL(url);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      urlBuilder.searchParams.append(key, `${value}`);
    });

    // Node Fetch for testing.
    // return (await fetch(urlBuilder.href, {
    //   body,
    //   headers,
    //   method
    // })).text();

    // Obsidian fetch for production use.
    return request({
      body,
      headers,
      method,
      url: urlBuilder.href
    });
  }

  async fetchJson<T>(
    requestConfig: HttpRequest
  ): Promise<T> {
    return JSON.parse(
      await this.fetch(requestConfig)
    );
  }

  private async _adaptRequest(
    requestConfig: HttpRequest
  ): Promise<HttpRequest> {
    if (this._baseUrl) {
      requestConfig.url = `${this._baseUrl}/${requestConfig.url}`;
    }

    for (const adapter of this._adapters) {
      requestConfig = await ((typeof adapter === 'function') ? adapter(requestConfig) : (
        adapter.adaptHttpRequest(requestConfig)
      ));
    }

    return requestConfig;
  }
}
