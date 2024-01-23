export function getValue<T, K extends keyof(T)>(
  item: T,
  deepKey: K,
  allowNull?: boolean
): T[K];
export function getValue<T = unknown>(
  item: any,
  deepKey: string,
  allowNull?: boolean
): T;
export function getValue(
  item: any,
  deepKey: string,
  allowNull = false
): unknown {
  deepKey.split('.').forEach((key) => {
    if (!key) {
      return;
    } else if (item != null) {
      item = item[key];
    } else if (allowNull) {
      item = undefined;
    } else {
      throw new Error('Trying to get value from null item.');
    }
  });

  return item;
}
