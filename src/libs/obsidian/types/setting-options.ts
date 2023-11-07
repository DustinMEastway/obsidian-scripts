import { SettingOption } from './setting-option';

export type SettingOptions<T> = SettingOption<
  keyof(T) & string,
  T[keyof(T)]
>[];
