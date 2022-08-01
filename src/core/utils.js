export const polarToCartesian = (a, origin = [0, 0], r = [1]) => {
  const sin = Math.sin(a);
  const cos = Math.cos(a);

  return r.map(r => [origin[0] + cos * r, origin[1] + sin * r]);
};

export const getAllNumbersFromAString = (str) => str.match(/\d+/g);

export const getAbsMax = (a, b) => Math.max(Math.abs(a), Math.abs(b));

export const getArrayLimits = (arr) => ({ min: Math.min(arr), max: Math.max(arr) });

export const abs = (n) => Math.abs(n);