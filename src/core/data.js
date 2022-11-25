import { abs, absMax, absMin } from './math.js';

export const prepareData = (dataset) => {
  const limits = {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
  };

  const sum = {
    unsigned: 0,
    signed: 0,
  };

  dataset.data.forEach((entry) => {
    sum.unsigned += abs(entry.value);
    sum.signed += entry.value;

    if (entry.value < limits.min) limits.min = entry.value;
    if (entry.value > limits.max) limits.max = entry.value;
  });

  limits.distance = limits.max - limits.min;
  limits.absMax = absMax(limits.min, limits.max);
  limits.absMix = absMin(limits.min, limits.max);

  return {
    limits,
    sum,
  };
};

export const getRadarDataLimits = (dataset) => {
  const limits = {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
  };

  dataset.data.forEach((entry) => {
    for (let j = 0; j < dataset.markers.length; j++) {
      if (entry.value[j] < limits.min) limits.min = entry.value[j];
      if (entry.value[j] > limits.max) limits.max = entry.value[j];
    }
  });

  limits.distance = limits.max - limits.min;

  return { limits };
};
