import { SettingOptionConfig } from './setting-option-config';

export type SettingOptionsConfig<T> = {
  [K in keyof(T)]: SettingOptionConfig<T[K]>;
}
