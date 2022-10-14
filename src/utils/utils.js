export const getAllNumbersFromAString = (str) => str.match(/\d+/g);

export const getArrayLimits = (arr) => ({
  min: Math.min(arr),
  max: Math.max(arr),
});