/** Globally defined Obsidian items. */
import { HttpRequestMethod } from "@/services/types";

declare global {
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
        value: string
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
