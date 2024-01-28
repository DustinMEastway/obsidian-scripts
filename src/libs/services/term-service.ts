import {
  createMarkdownArray,
  createMarkdownFileName,
  createMarkdownLink
} from '@/markdown';
import { NoteFolder } from '@/obsidian';
import { StringCase, convertCase } from '@/string';
import { HttpService } from './http-service';
import {
  DefinitionApi,
  DefinitionResponse,
  RawFreeDictionaryResponse,
  Term,
  ThesaurusApi,
  ThesaurusResponse
} from './types';

export type TermServiceCreateConfig = {
  definitionApi: DefinitionApi;
  definitionToken: string;
  thesaurusApi: ThesaurusApi;
  thesaurusToken: string;
};

export class TermService {
  constructor(
    private _definitionApi: DefinitionApi,
    private _definitionService: HttpService,
    private _thesaurusApi: ThesaurusApi,
    private _thesaurusService: HttpService
  ) {
    // Intentionally left blank.
  }

  static createService({
    definitionApi,
    definitionToken: _d,
    thesaurusApi,
    thesaurusToken: _t
  }: TermServiceCreateConfig): TermService {
    return new TermService(
      definitionApi,
      new HttpService(definitionApi, [
        (request) => {
          switch (definitionApi) {
            case DefinitionApi.freeDictionary:
              break;
            default:
              const neverApi: never = definitionApi;
              throw new Error(`API '${neverApi}' not fully set up`);
          }
          return request;
        }
      ]),
      thesaurusApi,
      new HttpService(thesaurusApi, [
        (request) => {
          switch (thesaurusApi) {
            case ThesaurusApi.freeDictionary:
              break;
            default:
              const neverApi: never = thesaurusApi;
              throw new Error(`Thesaurus API '${neverApi}' not fully set up`);
          }
          return request;
        }
      ])
    );
  }

  async getDefinition(term: string): Promise<DefinitionResponse | null> {
    const response: DefinitionResponse = {};
    switch (this._definitionApi) {
      case DefinitionApi.freeDictionary:
        const definitionSources = await this._definitionService.fetchJson<
          RawFreeDictionaryResponse
        >({
          url: term
        });

        if (!(definitionSources instanceof Array)) {
          return null;
        }

        definitionSources.forEach((definitionSource) => {
          definitionSource.meanings.forEach((meaning) => {
            response[meaning.partOfSpeech] = [
              ...response[meaning.partOfSpeech] ?? [],
              ...meaning.definitions.map(({ definition }) => {
                return definition;
              })
            ];
          })
        });
        break;
      default:
        const neverApi: never = this._definitionApi;
        throw new Error(`Definition API '${neverApi}' not implemented.`);
    }

    return response;
  }

  async getTerm(term: string): Promise<Term> {
    const [
      definitionResponse,
      thesaurusResponse
    ] = await Promise.all([
      this.getDefinition(term),
      this.getThesaurus(term)
    ]);
    const createTermLink = (
      term: string,
      inYaml = false
    ): string => {
      return createMarkdownLink(
        NoteFolder.term,
        convertCase(term, StringCase.title),
        { inYaml }
      );
    };
    const createTermLinks = (
      terms: string[],
      inYaml = false
    ): string => {
      const uniqueTerms = new Set(terms);

      return createMarkdownArray(
        [...uniqueTerms].map((term) => {
          return createTermLink(term, inYaml)
        }).sort(),
        { inYaml }
      );
    };
    const definitions = Object.keys(
      definitionResponse ?? thesaurusResponse ?? {}
    ).map((partOfSpeech) => {
      const definitions = definitionResponse?.[partOfSpeech] ?? [];
      const {
        antonyms,
        synonyms
      } = thesaurusResponse?.[partOfSpeech] ?? {};
      return (
        `## ${createTermLink(partOfSpeech)}\n`
        + createMarkdownArray(
          definitions,
          { inYaml: false }
        )
        + ((!synonyms?.length) ? '' : (
          `\n\n### ${createTermLink('Synonyms')}\n`
          + createTermLinks(synonyms)
        ))
        + ((!antonyms?.length) ? '' : (
          `\n\n### ${createTermLink('Antonyms')}\n`
          + createTermLinks(antonyms)
        ))
      );
    }).join('\n\n');

    return {
      antonymLinks: createTermLinks(
        Object.values(thesaurusResponse ?? {}).map((partOfSpeech) => {
          return partOfSpeech.antonyms;
        }).flat(),
        true
      ),
      definitions: (definitions) ? `\n\n${definitions}` : '',
      fileName: createMarkdownFileName(convertCase(term, StringCase.title)),
      synonymLinks: createTermLinks(
        Object.values(thesaurusResponse ?? {}).map((partOfSpeech) => {
          return partOfSpeech.synonyms;
        }).flat(),
        true
      )
    }
  }

  async getThesaurus(term: string): Promise<ThesaurusResponse | null> {
    const response: ThesaurusResponse = {};
    switch (this._thesaurusApi) {
      case ThesaurusApi.freeDictionary:
        const thesaurusSources = await this._thesaurusService.fetchJson<
          RawFreeDictionaryResponse
        >({
          url: term
        });

        if (!(thesaurusSources instanceof Array)) {
          return null;
        }

        thesaurusSources.forEach((thesaurusSource) => {
          thesaurusSource.meanings.forEach((meaning) => {
            response[meaning.partOfSpeech] ??= {
              antonyms: [],
              synonyms: []
            };
            const part = response[meaning.partOfSpeech];
            part.antonyms = [
              ...part.antonyms,
              ...meaning.antonyms,
              ...meaning.definitions.map(({ antonyms }) => {
                return antonyms;
              }).flat()
            ];
            part.synonyms = [
              ...part.synonyms,
              ...meaning.synonyms,
              ...meaning.definitions.map(({ synonyms }) => {
                return synonyms;
              }).flat()
            ];
          })
        });
        break;
      default:
        const neverApi: never = this._thesaurusApi;
        throw new Error(`Definition API '${neverApi}' not implemented.`);
    }

    return response;
  }
}
