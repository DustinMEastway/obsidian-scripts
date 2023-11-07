export interface PadConfig {
  char?: string;
  end?: boolean;
}

export function pad(
  value: string | number,
  minLength: number,
  {
    char = ' ',
    end = false
  }: PadConfig
) {
  value = `${value}`;
  while (value.length < minLength) {
    value = ((end) ? '' : char) + value + ((end) ? char : '');
  }
  return value;
}
