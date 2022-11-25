export const PI = Math.PI;

export const TAU = PI * 2;

export const HALF_PI = PI / 2;

export const THREE_HALVES_PI = (PI * 3) / 2;

export const PRECISION = 4;

export const polarToCartesian = (a, origin = [0, 0], r = [1]) => {
  const sin = Math.sin(a);
  const cos = Math.cos(a);

  return r.map((r) => [origin[0] + cos * r, origin[1] + sin * r]);
};

export const abs = (n) => Math.abs(n);

export const absMax = (a, b) => Math.max(Math.abs(a), Math.abs(b));
export const absMin = (a, b) => Math.min(Math.abs(a), Math.abs(b));

export const getVectorAngle = (vector) => {
  return Math.atan2(vector[1], vector[0]);
};

export const subtractVectors = (v1, v2) => {
  const x = v1[0] - v2[0];
  const y = v1[1] - v2[1];

  return [x, y];
};

export const fractionReminder = (a, b) => {
  //same as maplesoftware's frem
  if (a === b) return a;
  return a - b * Math.floor(a / b);
};

export const clampNumber = (n, a, b) => Math.max(Math.min(n, b), a);

export const isInSegment = (x, a, b) => a <= x && x <= b;

export const isInInterval = (x, a, b) => a < x && x < b;
