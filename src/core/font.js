import { setFont } from './canvas.js';

export const DEFAULT_FONT = {
  style: 'normal',
  variant: 'normal',
  weight: 'normal',
  size: 12,
  family: ['Helvetica', 'Arial', 'sans-serif'],
  toString() {
    return `${this.style} ${this.variant} ${this.weight} ${this.size}px/1 ${this.family}`;
  },
};

const TEXT_SAMPLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const calculateFontHeight = (ctx) => {
  const m = ctx.measureText(TEXT_SAMPLE);
  const h = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  return h;
};

export const normalizeFont = (userFont, ctx) => {
  const font = Object.assign(DEFAULT_FONT, userFont);
  setFont(ctx, font.toString());
  font.height = calculateFontHeight(ctx);
  return font;
};
