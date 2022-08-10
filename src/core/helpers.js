import { FONT, COLOR_SCHEME } from './defaults.js';

export const normalizeFont = (userFont) => {
  const font = Object.assign(FONT, userFont);
  font.string = `${font.style} ${font.variant} ${font.weight} ${font.size}px/1 ${font.family}`;
  return font;
};

export const getColorScale = () => { };

export const pickColorFromColorScale = () => { };

export const getRandomHexColor = () => `#${Math.trunc(Math.random() * 16777215).toString(16)}`;

export const getRandomRgbColor = (min = 90, max = 200) => {
  const color = [];
  const diff = max - min;

  for (let i = 0; i < 3; i++) {
    color[i] = Math.trunc(Math.random() * diff + min);
  }

  return `rgb(${color})`;
}

export const setCanvas = (canvas, ctx, settings) => {
  const bounds = canvas.getBoundingClientRect();

  canvas.width = bounds.width * settings.dpr;
  canvas.height = bounds.height * settings.dpr;
  ctx.scale(settings.dpr, settings.dpr);

  return [bounds.width, bounds.height];
};

export const getSquareDrawingArea = (settings) => {
  const area = {};

  area.height = settings.height - settings.legend.height;
  area.width = area.height;

  const x = (settings.width - area.width) / 2;
  const y = settings.legend.height;

  area.coordinates = [x, y];
  area.radius = Math.trunc(area.height / 2);
  area.center = [x + area.radius, y + area.radius];

  return area;
};

export const getColorScheme = (userColorScheme) => {
  return Object.assign(COLOR_SCHEME, userColorScheme);
};

export const getBaseRadius = (settings) => {
  if (settings.limits.min >= 0) return settings.radius.inner
  else if (settings.limits.max <= 0) return settings.radius.outer;
  else return -settings.limits.min / settings.limits.distance * settings.radius.outer;
}