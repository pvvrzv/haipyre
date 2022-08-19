export const getDataLimits = (dataset) => {
  const limits = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };


  dataset.data.forEach(entry => {
    if (entry.val < limits.min) limits.min = entry.val;
    if (entry.val > limits.max) limits.max = entry.val;
  });

  limits.distance = limits.max - limits.min;

  return limits;
};

export const getRadarDataLimits = (dataset) => {
  const limits = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };

  dataset.data.forEach(entry => {
    for (let j = 0; j < dataset.radarLabels.length; j++) {
      if (entry.val[j] < limits.min) limits.min = entry.val[j];
      if (entry.val[j] > limits.max) limits.max = entry.val[j];
    }
  });

  limits.distance = limits.max - limits.min;

  return limits;
};