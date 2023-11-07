import { SettingOptionType } from './setting-option-type';

export interface SettingOption<TKey extends string, TValue> {
  key: TKey;
  label: string;
  type: SettingOptionType;
  value: TValue;
};
