import { GetTaskTableConfig } from '../get-task-table-config';
import { ViewNote } from './view-note';

export type ViewTaskTableNote = (
  ViewNote
  & {
    queryConfig: GetTaskTableConfig<unknown>;
  }
);
