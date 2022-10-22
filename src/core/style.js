export const DEFAULT_GLOBAL_STYLE = {
  background: 'rgb(255, 255, 255)',
  data: {
    background: 'rgb(182, 203, 222)',
    border: 'rgb(229, 231, 233)',
  },
};

export const getRandomHexColor = () => `#${Math.trunc(Math.random() * 16777215).toString(16)}`;

export const getRandomRgbColor = (min = 90, max = 200) => {
  const color = [];
  const diff = max - min;

  for (let i = 0; i < 3; i++) {
    color[i] = Math.trunc(Math.random() * diff + min);
  }

  return `rgb(${color})`;
};

export const getGlobalStyle = (userStyle) => {
  return Object.assign(DEFAULT_GLOBAL_STYLE, userStyle);
};
