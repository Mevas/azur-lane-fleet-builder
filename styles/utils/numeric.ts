export const clamp = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(number, max));

export const average = (array: number[]) =>
  array.reduce((a, b) => a + b) / array.length;
