import {
  EntryApis,
  IgdbGameSeries,
  IgdbMediaType,
  IgdbSearchGame,
  SettingOptionType,
  TaskStatusOption,
  createError,
  createSettingOptions,
  createSettingsFromOptions,
  getClipboard,
  getWebTaskState,
  taskStatusConfig
} from '@';
import { IgdbService } from '@/services/igdb-service';

interface Settings {
  clientId: string;
  clientSecret: string;
  mediaType: IgdbMediaType;
  status: TaskStatusOption;
}

async function entry(
  entryApis: EntryApis,
  configOptions: Record<string, Settings[keyof(Settings)]>
) {
  const { quickAddApi } = entryApis;
  const {
    clientId,
    clientSecret,
    mediaType,
    status
  } = createSettingsFromOptions(
    configOptions,
    options
  );

  const igdbService = IgdbService.createService({
    clientId,
    clientSecret
  });

  const query = await quickAddApi.inputPrompt(
    `Enter a ${mediaType} query`,
    null,
    await getClipboard(quickAddApi)
  );
  if (!query) {
      throw createError('No query entered.');
  }

  const items = (mediaType === IgdbMediaType.game) ? (
    await igdbService.searchGames(query)
  ) : (
    await igdbService.searchGameSeries(query)
  );

  const choice = (items.length === 1) ? items[0] : (
    await quickAddApi.suggester<IgdbSearchGame | IgdbGameSeries>(
      items.map((item) => item.fileName),
      items
    )
  );
  if (!choice) {
    throw createError('No choice selected.');
  }

  const item = ('gameLinks' in choice) ? (
    choice
  ) : (
    await igdbService.getGame(choice.id)
  );

  entryApis.variables = {
    ...item,
    ...await getWebTaskState(entryApis, status)
  };
}

const options = createSettingOptions<Settings>({
  clientId: {
    label: 'Twitch Client ID',
    type: SettingOptionType.text,
    value: ''
  },
  clientSecret: {
    label: 'Twitch Client Secret',
    type: SettingOptionType.text,
    value: ''
  },
  mediaType: {
    label: 'Media Type',
    options: Object.values(IgdbMediaType),
    type: SettingOptionType.dropdown,
    value: IgdbMediaType.game
  },
  status: taskStatusConfig
});

export = {
  entry,
  settings: {
    name: 'Search IGDB',
    author: 'Dustin M. Eastway',
    options
  }
};
