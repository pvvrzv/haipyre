import { FONT, COLOR_SCHEME } from './defaults.js';

export const normalizeFont = (userFont) => {
  const font = Object.assign(FONT, userFont);
  font.string = `${font.style} ${font.variant} ${font.weight} ${font.size}px/1 ${font.family}`;
  return font;
};

export const getColorScale = () => {};

export const pickColorFromColorScale = () => {};

export const getRandomHexColor = () =>
  `#${Math.trunc(Math.random() * 16777215).toString(16)}`;

export const getRandomRgbColor = (min = 90, max = 200) => {
  const color = [];
  const diff = max - min;

  for (let i = 0; i < 3; i++) {
    color[i] = Math.trunc(Math.random() * diff + min);
  }

  return `rgb(${color})`;
};

export const setCanvas = (canvas, ctx, settings) => {
  const bounds = canvas.getBoundingClientRect();

  canvas.width = bounds.width * settings.dpr;
  canvas.height = bounds.height * settings.dpr;
  ctx.scale(settings.dpr, settings.dpr);

  return [bounds.width, bounds.height];
};

export const getColorScheme = (userColorScheme) => {
  return Object.assign(COLOR_SCHEME, userColorScheme);
};

export const getBaseRadius = (radius, limits) => {
  if (limits.min >= 0) return radius.inner;
  else if (limits.max <= 0) return radius.outer;
  else return (-limits.min / limits.distance) * radius.outer;
};
