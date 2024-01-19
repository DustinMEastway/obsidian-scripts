import { createDateLink, createMarkdownLink } from '@/markdown';
import { NoteFolder, TaskStatus } from './constants';
import { EntryApis, SettingOptionType } from './types';

/** Add this to your settings type. */
export type TaskStatusOption = TaskStatus | 'null';

/** Add this to your settings config. */
export const taskStatusConfig = {
  label: 'Status (null to pick on add)',
  options: Object.values<TaskStatusOption>(TaskStatus).concat('null'),
  type: SettingOptionType.dropdown,
  value: 'null'
} as const;

type TaskState = {
  finishedOn: string;
  startedOn: string;
  status: string;
};

export async function getWebTaskState(
  entryApis: EntryApis,
  status?: TaskStatusOption | null
): Promise<TaskState> {
  if (!status || status === 'null') {
    const statuses = Object.values(TaskStatus);
    status = await entryApis.quickAddApi.suggester(
      statuses,
      statuses
    );
  }
  const taskState: TaskState = {
    finishedOn: 'null',
    startedOn: 'null',
    status: createMarkdownLink(NoteFolder.statusBasic, status)
  };

  const today = createDateLink(Date.now());
  if (status === TaskStatus.done) {
    taskState.finishedOn = today;
    taskState.startedOn = today;
  } else if (status === TaskStatus.inProgress) {
    taskState.startedOn = today;
  }

  return taskState;
}
