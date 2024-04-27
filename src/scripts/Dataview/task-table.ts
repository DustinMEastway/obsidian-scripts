import {
  ViewTaskTableNote,
  getTaskTable
} from '@';

const { queryConfig } = dv.current<ViewTaskTableNote>();

getTaskTable(
  {
    dataviewApi: dv,
    obsidianApi: app
  },
  queryConfig
);
