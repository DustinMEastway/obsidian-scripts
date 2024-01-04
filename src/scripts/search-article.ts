import {
  EntryApis,
  HttpRequestMethod,
  createError,
  createMarkdownFileName,
  createMarkdownHeaders,
  getClipboard,
  getHtmlHeaders,
  getHtmlTitle
} from "@";

async function entry(
  entryApis: EntryApis
) {
  const { quickAddApi } = entryApis;
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
  const headers = createMarkdownHeaders(
    getHtmlHeaders(response).map((header) => {
      header.level += 1;
      return header;
    })
  );

  entryApis.variables = {
    headers: (headers) ? `\n${headers}` : '',
    fileName: createMarkdownFileName(getHtmlTitle(response) ?? ''),
    url: query
  };
}

export = {
  entry,
  settings: {
    name: 'Search article',
    author: 'Dustin M. Eastway'
  }
};
