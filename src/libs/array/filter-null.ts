export function filterNull<T>(
  items: (T | null | undefined)[]
): T[] {
  return items.filter((item) => {
    return item != null;
  }) as T[];
}
