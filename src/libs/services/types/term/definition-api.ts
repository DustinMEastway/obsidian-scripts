import { TermBaseApi } from './term-base-api';

export enum DefinitionApi {
  // Note: You have to make this a string or the output gets weird.
  freeDictionary = `${TermBaseApi.freeDictionary}`
  // websterCollegiate = `${TermBaseApi.webster}/collegiate/json`,
  // websterIntermediate = `${TermBaseApi.webster}/sd3/json`
}
