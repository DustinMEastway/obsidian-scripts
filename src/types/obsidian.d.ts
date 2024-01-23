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

  class URL {
    href: string;

    constructor(path: string);

    searchParams: {
      append(
        key: string,
        value: number | string
      ): void;
    };
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
