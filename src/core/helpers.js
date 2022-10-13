import { DOUBLE_PI, PI } from './defaults.js';

export const getBaseRadius = (radius, limits) => {
  if (limits.min >= 0) return radius.inner;
  else if (limits.max <= 0) return radius.outer;
  else return (-limits.min / limits.distance) * radius.outer;
};

export const clampNumber = (x, y) => {
  //same as maplesoftware's frem
  if (x === y) return x;
  return x - y * Math.floor(x / y);
};
