/** Globally defined Obsidian items. */
import { HttpRequestMethod } from '@';

declare global {
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
