import { PI, DOUBLE_PI } from "./defaults.js";
import { polarToCartesian } from "../utils/utils.js";

export const renderCircle = (ctx, coordinates, r) => {
  ctx.arc(...coordinates, r, 0, DOUBLE_PI, false);
};

export const renderDiscSegment = (ctx, coordinates, r, sa, ea, rotation) => {
  ctx.moveTo(...coordinates);
  ctx.arc(...coordinates, r, sa + rotation, ea + rotation, false);
  ctx.closePath();
};

export const renderCircleSegment = (ctx, coordinates, r1, r2, sa, ea) => {
  const startAngle = sa + rotation;
  const endAngle = ea + rotation;

  ctx.arc(...coordinates, r1, startAngle, endAngle, false);
  ctx.arc(...coordinates, r2, endAngle, startAngle, true);
};

export const renderRectangle = (ctx, coordinates, width, height) => {
  ctx.rect(...coordinates, width, height);
};

export const renderPolygon = (ctx, coordinates, r, n, startAngle) => {
  const angle = 2 * PI / n;

  ctx.moveTo(...polarToCartesian(startAngle, coordinates, [r])[0]);

  for (let i = 1; i < n; i++) {
    ctx.lineTo(...polarToCartesian(startAngle + angle * i, coordinates, [r])[0]);
  }

  ctx.closePath();
};

export const rect = (ctx, coordinates, width, height) => ctx.rect(...coordinates, width, height);

export const fillRect = (ctx, coordinates, width, height) => ctx.fillRect(...coordinates, width, height);

export const strokeRect = (ctx, coordinates, width, height) => ctx.strokeRect(...coordinates, width, height);

export const lineTo = (ctx, coordinates) => ctx.lineTo(...coordinates);

export const moveTo = (ctx, coordinates) => ctx.moveTo(...coordinates);

export const beginPath = (ctx) => ctx.beginPath();

export const closePath = (ctx) => ctx.closePath();

export const saveContext = (ctx) => ctx.save();

export const restoreContext = (ctx) => ctx.restore();

export const fillText = (ctx, text, coordinates) => ctx.fillText(text, ...coordinates);

export const strokeText = (ctx, text, coordinates) => ctx.strokeText(text, ...coordinates);

export const drawImage = (ctx, image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) => ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

export const setFillStyle = (ctx, style) => ctx.fillStyle = style;

export const setStrokeStyle = (ctx, style) => ctx.strokeStyle = style;

export const setfont = (ctx, font) => ctx.font = font;

export const setTextAlign = (ctx, value) => ctx.textAlign = value;

export const setTextBaseLing = (ctx, value) => ctx.textBaseLine = value;

export const setLineWidth = (ctx, width) => ctx.lineWidth = width;

export const setGlobalAlpha = (ctx, value) => ctx.setGlobalAlpha = value;

export const fill = (ctx) => ctx.fill();

export const stroke = (ctx) => ctx.stroke();

export const fillPath = (ctx, path) => ctx.fill(path);

export const strokePath = (ctx, path) => ctx.stroke(path);