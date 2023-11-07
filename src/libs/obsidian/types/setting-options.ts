import { SettingOption } from './setting-option';

export type SettingOptions<T> = Record<
  string,
  SettingOption<
    keyof(T) & string,
    T[keyof(T)]
  >
>;
