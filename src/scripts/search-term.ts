import {
  DefinitionApi,
  EntryApis,
  SettingOptionType,
  TermService,
  TermServiceCreateConfig,
  ThesaurusApi,
  createError,
  createSettingOptions,
  createSettingsFromOptions,
  getClipboard
} from '@';

type Settings = TermServiceCreateConfig;

async function entry(
  entryApis: EntryApis,
  configOptions: Record<string, Settings[keyof(Settings)]>
) {
  const { quickAddApi } = entryApis;
  const createConfig = createSettingsFromOptions(
    configOptions,
    options
  );

  const termService = TermService.createService(createConfig);
  const query = await quickAddApi.inputPrompt(
    `Enter a term`,
    null,
    await getClipboard(quickAddApi)
  );
  if (!query) {
      throw createError('No query entered.');
  }

  entryApis.variables = await termService.getTerm(query);
}

const options = createSettingOptions<Settings>({
  definitionApi: {
    label: 'Definition Api',
    options: Object.values(DefinitionApi),
    type: SettingOptionType.dropdown,
    value: DefinitionApi.freeDictionary
  },
  definitionToken: {
    label: 'Definition Token',
    type: SettingOptionType.text,
    value: ''
  },
  thesaurusApi: {
    label: 'Thesaurus Api',
    options: Object.values(ThesaurusApi),
    type: SettingOptionType.dropdown,
    value: ThesaurusApi.freeDictionary
  },
  thesaurusToken: {
    label: 'Thesaurus Token',
    type: SettingOptionType.text,
    value: ''
  }
});

export = {
  entry,
  settings: {
    name: 'Search Terms',
    author: 'Dustin M. Eastway',
    options
  }
};
