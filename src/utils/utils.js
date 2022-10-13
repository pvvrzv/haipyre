import { DOUBLE_PI, HALF_PI } from '../core/defaults.js';

export const polarToCartesian = (a, origin = [0, 0], r = [1]) => {
  const sin = Math.sin(a);
  const cos = Math.cos(a);

  return r.map((r) => [origin[0] + cos * r, origin[1] + sin * r]);
};

export const getAllNumbersFromAString = (str) => str.match(/\d+/g);

export const getAbsMax = (a, b) => Math.max(Math.abs(a), Math.abs(b));

export const getArrayLimits = (arr) => ({
  min: Math.min(arr),
  max: Math.max(arr),
});

export const abs = (n) => Math.abs(n);

export const isPointInLineSegment = (px, line) => (px >= line[0] && px <= line[1] ? true : false);

export const getVectorAngle = (vector) => {
  return Math.atan2(vector[1], vector[0]);
};

export const subtractVectors = (v1, v2) => {
  const x = v1[0] - v2[0];
  const y = v1[1] - v2[1];

  return [x, y];
};
