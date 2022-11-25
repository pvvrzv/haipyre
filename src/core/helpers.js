export const getBaseRadius = (radius, dataLimits) => {
  if (dataLimits.min >= 0) return radius.inner;
  else if (dataLimits.max <= 0) return radius.outer;
  else return (-dataLimits.min / dataLimits.distance) * radius.outer;
};
