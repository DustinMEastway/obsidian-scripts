import {
  EntryApis,
  GoodreadsAuthor,
  GoodreadsBook,
  GoodreadsBookSeries,
  GoodreadsMediaType,
  GoodreadsService,
  SettingOptionType,
  createError,
  createMarkdownFileName,
  createSettingOptions,
  createSettingsFromOptions,
  getClipboard
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
    await getClipboard(quickAddApi)
  );
  if (!query) {
      throw createError('No query entered.');
  }

  let item: (
    GoodreadsAuthor
    | GoodreadsBook
    | GoodreadsBookSeries
    | null
  ) = null;
  if (mediaType === GoodreadsMediaType.author) {
    item = await goodreadsService.getAuthor(query);
  } else if (mediaType === GoodreadsMediaType.book) {
    item = await goodreadsService.getBook(query);
  } else if (mediaType === GoodreadsMediaType.bookSeries) {
    item = await goodreadsService.getBookSeries(query);
  }

  entryApis.variables = (item == null) ? item : {
    ...item,
    fileName: createMarkdownFileName(item.title ?? '')
  };
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
