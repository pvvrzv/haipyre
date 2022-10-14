export const PI = 3.14;

export const DOUBLE_PI = 6.28;

export const HALF_PI = 1.57;

export const THREE_QUARTER_PI = 4.71;

export const PRECISION = 4;

export const polarToCartesian = (a, origin = [0, 0], r = [1]) => {
  const sin = Math.sin(a);
  const cos = Math.cos(a);

  return r.map((r) => [origin[0] + cos * r, origin[1] + sin * r]);
};

export const abs = (n) => Math.abs(n);

export const absMax = (a, b) => Math.max(Math.abs(a), Math.abs(b));

export const getVectorAngle = (vector) => {
  return Math.atan2(vector[1], vector[0]);
};

export const subtractVectors = (v1, v2) => {
  const x = v1[0] - v2[0];
  const y = v1[1] - v2[1];

  return [x, y];
};

export const clampNumber = (x, y) => {
  //same as maplesoftware's frem
  if (x === y) return x;
  return x - y * Math.floor(x / y);
};
