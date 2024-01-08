import {
  EntryApis,
  HttpRequestMethod,
  TaskStatusOption,
  createError,
  createMarkdownFileName,
  createMarkdownHeaders,
  createSettingOptions,
  createSettingsFromOptions,
  getClipboard,
  getHtmlHeaders,
  getHtmlTitle,
  getJsWeeklyHeaders,
  getWebTaskState,
  taskStatusConfig,
} from "@";

type Settings = {
  status: TaskStatusOption;
}

async function entry(
  entryApis: EntryApis,
  configOptions: Record<string, Settings[keyof(Settings)]>
) {
  const { quickAddApi } = entryApis;
  const {
    status
  } = createSettingsFromOptions(
    configOptions,
    options
  );
  const query = await quickAddApi.inputPrompt(
    'Enter article URL: ',
    null,
    await getClipboard(quickAddApi)
  );
  if (!query) {
    throw createError('No query entered.');
  }

  const response = await request({
    url: query,
    method: HttpRequestMethod.get
  });
  const headerGetter = (query.includes('javascriptweekly.com')) ? (
    getJsWeeklyHeaders
  ) : getHtmlHeaders;
  const headers = createMarkdownHeaders(
    headerGetter(response).map((header) => {
      header.level += 1;
      return header;
    })
  );

  entryApis.variables = {
    headers: (headers) ? `\n${headers}` : '',
    fileName: createMarkdownFileName(getHtmlTitle(response) ?? ''),
    url: query,
    ...await getWebTaskState(entryApis, (status === 'null') ? null : status)
  };
}

const options = createSettingOptions<Settings>({
  status: taskStatusConfig
});

export = {
  entry,
  settings: {
    name: 'Search article',
    author: 'Dustin M. Eastway',
    options
  }
};
