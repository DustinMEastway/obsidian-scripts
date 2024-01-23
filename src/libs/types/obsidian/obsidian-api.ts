import { DataviewApi } from './dataview';
import { ObsidianPage } from './obsidian-page';

export type ObsidianApi = {
  plugins: {
    plugins: {
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
