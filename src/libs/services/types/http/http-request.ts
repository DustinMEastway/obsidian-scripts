export enum HttpRequestMethod {
  get = 'GET',
  post = 'POST'
}

export type HttpRequest = {
  headers?: Record<string, string>;
  query?: Record<string, number | string>;
  url: string;
} & (
  {
    body?: never;
    method?: HttpRequestMethod.get
  } | {
    body: string | undefined;
    method: HttpRequestMethod.post;
  }
);
