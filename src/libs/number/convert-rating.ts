export interface ConvertRatingProps {
  maxValue: number;
  minValue: number;
  value: null | number;
}

export function convertRating({
  maxValue,
  minValue,
  value
}: ConvertRatingProps): null | number {
  return (!value) ? null : Math.round(100 * (value - minValue) / (maxValue - minValue));
}
