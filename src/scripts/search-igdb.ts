import {
  EntryApis,
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
    'Enter a query',
    null,
    await getClipboard(quickAddApi)
  );
  if (!query) {
      throw createError('No query entered.');
  }

  const games = await igdbService.searchGames(query);
  const choice = (games.length === 1) ? games[0] : (
    await quickAddApi.suggester(
      games.map((item) => item.fileName),
      games
    )
  );
  if (!choice) {
    throw createError('No choice selected.');
  }

  entryApis.variables = {
    ...await igdbService.getGame(choice.id),
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
