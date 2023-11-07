import {
  SettingOption,
  SettingOptionConfig,
  SettingOptions,
  SettingOptionsConfig
} from './types';

export function createSettingOptions<T>(
  config: SettingOptionsConfig<T>
): SettingOptions<T> {
  return Object.fromEntries(
    Object.entries<SettingOptionConfig<T[keyof(T)]>>(config).map(([
      key,
      option
    ]): [
      string,
      SettingOption<keyof(T) & string, T[keyof(T)]>
    ] => {
      return [
        option.label,
        {
          ...option,
          key: key as keyof(T) & string,
          value: option.value as T[keyof(T)]
        }
      ];
    })
  );
}
