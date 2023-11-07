import { SettingOptionType } from './setting-option-type';

export interface BaseSettingOptionConfig<TValue> {
  label: string;
  value: TValue;
};

export interface DropdownSettingOptionConfig<
  TValue extends string
> extends BaseSettingOptionConfig<TValue> {
  options: string[];
  type: SettingOptionType.dropdown;
};

export interface NeverSettingOptionConfig extends BaseSettingOptionConfig<never> {
  type: SettingOptionType.never;
};

export interface TextSettingOptionConfig<
  TValue extends string
> extends BaseSettingOptionConfig<TValue> {
  type: SettingOptionType.text;
};

export type SettingOptionConfig<TValue> = (
  TValue extends string ? (
    DropdownSettingOptionConfig<TValue>
    | TextSettingOptionConfig<TValue>
  ) : NeverSettingOptionConfig
);
