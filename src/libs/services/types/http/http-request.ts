export enum HttpRequestMethod {
  get = 'GET'
}

export type HttpRequest = {
  headers?: Record<string, string>;
  method?: HttpRequestMethod;
  query?: Record<string, string>;
  url: string;
}
