import { sum } from "./sum";

/** Take the average of the @see numbers. */
export function average(numbers: number[]): number {
  return sum(numbers) / numbers.length;
}
