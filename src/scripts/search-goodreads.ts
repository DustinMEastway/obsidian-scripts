import {
  EntryApis,
  GoodreadsMediaType,
  GoodreadsService,
  SettingOptionType,
  createError,
  createSettingOptions,
  createSettingsFromOptions
} from "@";

interface Settings {
  mediaType: GoodreadsMediaType;
}

async function entry(
  entryApis: EntryApis,
  configOptions: Record<string, Settings[keyof(Settings)]>
) {
  const { quickAddApi } = entryApis;
  const {
    mediaType
  } = createSettingsFromOptions(
    configOptions,
    options
  );

  const goodreadsService = GoodreadsService.createService();
  const query = await quickAddApi.inputPrompt(
    'Enter movie title or IMDB ID: ',
    null,
    await quickAddApi.utility.getClipboard()
  );
  if (!query) {
      throw createError('No query entered.');
  }

  let item: typeof entryApis.variables = null;
  if (mediaType === GoodreadsMediaType.book) {
    item = await goodreadsService.getBook(query);
  }

  entryApis.variables = item;
}

const options = createSettingOptions<Settings>({
  mediaType: {
    label: 'Media Type',
    options: Object.values(GoodreadsMediaType),
    type: SettingOptionType.dropdown,
    value: GoodreadsMediaType.book
  }
});

export = {
  entry,
  settings: {
    name: 'Search Goodreads',
    author: 'Dustin M. Eastway',
    options
  }
};
