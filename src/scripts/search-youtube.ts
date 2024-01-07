import {
  EntryApis,
  SettingOptionType,
  TaskStatusOption,
  YoutubeMediaType,
  YoutubeService,
  createError,
  createMarkdownFileName,
  createSettingOptions,
  createSettingsFromOptions,
  getClipboard,
  getWebTaskState,
  taskStatusConfig,
  youtubeUrl
} from "@";

enum ApiUrl {
  youtubeV3 = 'https://www.googleapis.com/youtube/v3'
};

interface Settings {
  apiKey: string;
  apiUrl: ApiUrl;
  mediaType: YoutubeMediaType;
  status: TaskStatusOption;
}

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
  const youtubeService = YoutubeService.createService({
    apiKey,
    apiUrl,
    mediaType
  });
  let query = await quickAddApi.inputPrompt(
    `Enter a search for ${mediaType}: `,
    null,
    await getClipboard(quickAddApi)
  );
  if (!query) {
    throw createError('No query entered.');
  }

  const videoId = new RegExp(`${youtubeUrl}/watch\\?.*\\bv=([^&]+)`).exec(query)?.[1];
  if (videoId) {
    query = videoId;
  } else if (query.startsWith(`${youtubeUrl}/`)) {
    query = query.slice(youtubeUrl.length + 1);
  }

  const search = async () => {
    const options = await youtubeService.search(query);
    const choice = (options.length === 1) ? options[0] : (
      await quickAddApi.suggester(
        options.map(({ description, title }) => {
          return `${title} - ${description}`;
        }),
        options
      )
    );
    if (!choice) {
      throw createError('No choice selected.');
    }

    return choice;
  };

  switch (mediaType) {
    case YoutubeMediaType.channel: {
      const { id } = await search();
      entryApis.variables = await youtubeService.getChannel(id);
      break;
    }
    case YoutubeMediaType.video: {
      let item = await youtubeService.getVideo(query);
      if (!item) {
        const { id } = await search();
        item = await youtubeService.getVideo(id);
      }
      entryApis.variables = {
        ...item,
        ... await getWebTaskState(entryApis, status)
      };
      break;
    }
    default:
      throw createError(`Unknown mediaType '${mediaType}' provided.`);
  }

  if (entryApis.variables == null) {
    throw createError(`Unable to find selected YouTube ${mediaType}.`);
  }

  if (typeof entryApis.variables?.title === 'string') {
    entryApis.variables.fileName = createMarkdownFileName(
      entryApis.variables.title
    );
  }
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
    value: ApiUrl.youtubeV3
  },
  mediaType: {
    label: 'Media Type',
    options: Object.values(YoutubeMediaType),
    type: SettingOptionType.dropdown,
    value: YoutubeMediaType.video
  },
  status: taskStatusConfig
});

export = {
  entry,
  settings: {
    name: 'Search YouTube',
    author: 'Dustin M. Eastway',
    options
  }
};
