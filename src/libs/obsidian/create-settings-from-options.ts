import { SettingOptions } from './types';

export function createSettingsFromOptions<T>(
  config: Record<string, T[keyof(T)]>,
  options: SettingOptions<T>
): T {
  return Object.fromEntries(
    Object.entries(options).map(([
      _,
      {
        key,
        label
      }
    ]): [keyof(T), T[keyof(T)]] => {
      return [key, config[label]];
    })
  ) as T;
}
