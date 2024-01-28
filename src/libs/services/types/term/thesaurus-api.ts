import { TermBaseApi } from './term-base-api';

export enum ThesaurusApi {
  // Note: You have to make this a string or the output gets weird.
  freeDictionary = `${TermBaseApi.freeDictionary}`
  // websterCollegiate = `${TermBaseApi.webster}/thesaurus/json`,
  // websterIntermediate = `${TermBaseApi.webster}/ithesaurus/json`
}
