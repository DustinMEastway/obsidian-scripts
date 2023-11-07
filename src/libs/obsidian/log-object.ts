import { EntryApis } from './types';

export async function logObject<T>(
  { quickAddApi }: EntryApis,
  title: string,
  item: T
): Promise<T> {
  const options = [
    title,
    ...(!item || typeof item !== 'object') ? (
      [item?.toString() ?? 'null']
    ) : (
      Object.entries(item).map(([key, value]) => {
        return `${key} = ${JSON.stringify(value)}`;
      })
    )
  ];

  await quickAddApi.suggester(
    options,
    options
  );

  return item;
}
