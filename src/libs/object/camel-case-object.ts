import {
  StringCase,
  convertCase
} from '@/string';

export function camelCaseObject<T>(item: unknown): T {
  if (item == null || typeof item !== 'object') {
    return item as T;
  } else if (item instanceof Array) {
    return item.map(camelCaseObject) as T;
  }

  return Object.fromEntries(
    Object.entries(item).map(([key, value]): [string, T[keyof(T)]] => {
      return [
        convertCase(key, StringCase.camel),
        camelCaseObject(value)
      ];
    }).sort(([a], [b]) => {
      return a.localeCompare(b);
    })
  ) as T;
}
