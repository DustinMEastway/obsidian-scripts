/** Pick specific @see keys off from @see item. */
export function pick<T, K extends keyof(T)>(
  item: T,
  keys: K[]
): Pick<T, K> {
  return Object.fromEntries(
    keys.map((key) => {
      return [key, item[key]];
    })
  ) as Pick<T, K>;
}
