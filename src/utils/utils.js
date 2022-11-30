export const getAllNumbersFromAString = (str) => str.match(/\d+/g);

export const getArrayLimits = (arr) => ({
  min: Math.min(arr),
  max: Math.max(arr),
});

export function createBound(list) {
  // supposed to be called by using .call(this, [list])
  for (const method of list) {
    this[method] = this[method].bind(this);
  }
}
