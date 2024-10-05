import { createMarkdownArray } from './create-markdown-array';

type MarkdownArray = ReturnType<typeof createMarkdownArray>;

export type CombineMarkdownArrayConfig<T> = {
  /** Whether this array is in YAML or not @default true. */
  inYaml?: boolean;
  key: keyof(T) | ((item: T) => MarkdownArray);
};

/** Combine markdown arrays created by @see createMarkdownArray. */
export function combineMarkdownArray(
  items: MarkdownArray[],
  config?: Omit<CombineMarkdownArrayConfig<MarkdownArray>, 'key'>
): MarkdownArray;
export function combineMarkdownArray<T>(
  items: T[],
  config: CombineMarkdownArrayConfig<T>
): MarkdownArray;
export function combineMarkdownArray<T>(
  items: T[],
  {
    key = (item: T) => {
      // key is only unset for MarkdownArray items.
      return item as MarkdownArray;
    },
    inYaml = true
  }: (
    Omit<CombineMarkdownArrayConfig<T>, 'key'>
    & { key?: CombineMarkdownArrayConfig<T>['key'] }
  ) = {}
): MarkdownArray {
  const getValue = (typeof key === 'function') ? key : (
    (item: T) => {
      return item[key] as MarkdownArray;
    }
  );
  const emptyValue = (inYaml) ? 'null' : '';
  const uniqueItems = [...new Set(
    items.flatMap((item) => {
      const value = getValue(item);
      return (value === emptyValue) ? [] : value.split('\n');
    }).filter(Boolean)
  )].sort();
  return (!uniqueItems.length) ? emptyValue : '\n' + uniqueItems.join('\n');
}
