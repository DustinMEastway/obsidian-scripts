import {
  EntryApis,
  OmdbMediaType,
  OmdbService,
  SettingOptionType,
  TaskStatusOption,
  createError,
  createSettingOptions,
  createSettingsFromOptions,
  getClipboard,
  getWebTaskState,
  taskStatusConfig
} from '@';

enum ApiUrl {
  omdb = 'https://www.omdbapi.com'
};

interface Settings {
  apiKey: string;
  apiUrl: ApiUrl;
  mediaType: OmdbMediaType;
  status: TaskStatusOption;
}

const imdbIdSearch = /^tt\d+$/;
async function entry(
  entryApis: EntryApis,
  configOptions: Record<string, Settings[keyof(Settings)]>
) {
  const { quickAddApi } = entryApis;
  const {
    apiKey,
    apiUrl,
    mediaType,
    status
  } = createSettingsFromOptions(
    configOptions,
    options
  );

  const omdbService = OmdbService.createService({
    apiKey,
    apiUrl
  });

  let query = await quickAddApi.inputPrompt(
    'Enter movie title or IMDB ID: ',
    null,
    await getClipboard(quickAddApi)
  );
  if (!query) {
      throw createError('No query entered.');
  }

  if (!imdbIdSearch.test(query)) {
    const options = await omdbService.getByQuery(query, mediaType);
    const choice = (options.length === 1) ? options[0] : (
      await quickAddApi.suggester(
        options.map((item) => omdbService.convertTitle(item)),
        options
      )
    )
    if (!choice) {
      throw createError('No choice selected.');
    }

    query = choice.imdbId;
  }

  entryApis.variables = {
    ...await omdbService.getById(query),
    ...await getWebTaskState(entryApis, status)
  };
}

const options = createSettingOptions<Settings>({
  apiKey: {
    label: 'API Key',
    type: SettingOptionType.text,
    value: ''
  },
  apiUrl: {
    label: 'API URL',
    options: Object.values(ApiUrl),
    type: SettingOptionType.dropdown,
    value: ApiUrl.omdb
  },
  mediaType: {
    label: 'Media Type',
    options: Object.values(OmdbMediaType),
    type: SettingOptionType.dropdown,
    value: OmdbMediaType.movie
  },
  status: taskStatusConfig
});

export = {
  entry,
  settings: {
    name: 'Search OMDB',
    author: 'Dustin M. Eastway',
    options
  }
};
