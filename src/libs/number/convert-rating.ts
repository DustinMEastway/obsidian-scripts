export interface ConvertRatingProps {
  maxValue: number;
  minValue: number;
  value: null | number;
}

/**
 * Converts a rating to a percentage.
 *
 * @note For example this could convert a 1-5 star rating to a 0-100 scale.
 */
export function convertRating({
  maxValue,
  minValue,
  value
}: ConvertRatingProps): number | 'null' {
  if (value) {
    value = Math.round(100 * (value - minValue) / (maxValue - minValue));
  }

  return (!value || isNaN(value)) ? 'null' : value;
}
