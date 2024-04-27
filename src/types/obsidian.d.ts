/** Globally defined Obsidian items. */
import {
  DataviewApi,
  HttpRequestMethod,
  ObsidianApi
} from '@';

declare global {
  const app: ObsidianApi;

  const dv: DataviewApi;

  class Notice {
    constructor(
      message: string,
      durationInMs: number
    );
  }

  function request(
    config: {
      body?: string;
      headers?: Record<string, string>;
      method?: HttpRequestMethod;
      url: string;
    }
  ): Promise<string>;
}
