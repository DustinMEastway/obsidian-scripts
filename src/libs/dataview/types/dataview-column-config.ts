import { DataviewValueGetter } from './dataview-value-getter';

export type DataviewColumnConfig<T> = {
  property: DataviewValueGetter<T, any>;
  title: string;
};
