/** Sum all @see numbers together. */
export function sum(numbers: number[]): number {
  return numbers.reduce((sum, number) => {
    return sum + number;
  }, 0);
}
