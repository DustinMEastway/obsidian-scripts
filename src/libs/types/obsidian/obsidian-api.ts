import { DataviewApi } from './dataview';
import { ObsidianPage } from './obsidian-page';

export type ObsidianApi = {
  plugins: {
    plugins: {
      dataview: {
        /** @warning Using @see DataviewApi.table off from here does not work. */
        api: DataviewApi;
      };
      ['metadata-menu']: {
        api: {
          fieldModifier: <T>(
            dataviewApi: DataviewApi,
            page: ObsidianPage<T>,
            field: keyof(T)
          ) => unknown;
        };
      };
    };
  };
  vault: {
    adapter: {
      basePath: string;
    };
  };
};
