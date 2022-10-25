export const getDataLimits = (dataset) => {
  const limits = {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
  };

  dataset.data.forEach((entry) => {
    if (entry.value < limits.min) limits.min = entry.value;
    if (entry.value > limits.max) limits.max = entry.value;
  });

  limits.distance = limits.max - limits.min;

  return limits;
};

export const getRadarDataLimits = (dataset) => {
  const limits = {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
  };

  dataset.data.forEach((entry) => {
    for (let j = 0; j < dataset.radarLabels.length; j++) {
      if (entry.value[j] < limits.min) limits.min = entry.value[j];
      if (entry.value[j] > limits.max) limits.max = entry.value[j];
    }
  });

  limits.distance = limits.max - limits.min;

  return limits;
};
