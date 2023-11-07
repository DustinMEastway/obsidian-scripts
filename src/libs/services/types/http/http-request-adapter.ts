import { HttpRequest } from './http-request';

export type HttpRequestAdapterFunction = (
  httpRequest: HttpRequest
) => HttpRequest | Promise<HttpRequest>;

export type HttpRequestAdapterObject = {
  adaptHttpRequest: HttpRequestAdapterFunction;
};

export type HttpRequestAdapter = (
  HttpRequestAdapterFunction
  | HttpRequestAdapterObject
);
