import { PI, doublePI, halfPI } from '../core/defaults.js';
import { getDataLimits, normalizeFont, setCanvas, getSquareDrawingArea, getColorScheme, getBaseRadius } from '../core/helpers.js';
import { displayLegend } from '../core/layout.js';
import { abs } from '../core/utils.js';
import { fillText, renderDiscSegment, fill, renderCircle, stroke, setStrokeStyle, setFillStyle, beginPath, fillRect } from '../core/canvas.js';

const displayData = (settings) => {
  const stepAngle = doublePI / settings.dataset.data.length;
  let startAngle = -halfPI;
  let currentAngle = 0;
  let i = 0;

  setStrokeStyle(settings.ctx, settings.colorScheme.background)

  while (i < settings.dataset.data.length) {
    const ratio = settings.dataset.data[i].val / settings.limits.distance;
    const r = settings.radius.base + settings.radius.outer * ratio;
    currentAngle = startAngle + stepAngle;

    setFillStyle(settings.ctx, settings.dataset.data[i].background || settings.colorScheme.data.background);
    beginPath(settings.ctx);
    renderDiscSegment(settings.ctx, settings.drawingArea.center, r, startAngle, currentAngle);
    fill(settings.ctx);
    stroke(settings.ctx);

    startAngle = currentAngle;
    i++;
  }
};

export const start = (canvas, options) => {
  const settings = Object.assign({}, options);

  settings.TYPE = '0';
  settings.canvas = canvas;
  settings.dpr = window.devicePixelRatio || 1;
  settings.ctx = canvas.getContext('2d');
  [settings.width, settings.height] = setCanvas(settings.canvas, settings.ctx, settings.dpr);
  settings.colorScheme = getColorScheme(options.colorScheme);

  settings.limits = getDataLimits(options.dataset.data);
  settings.font = normalizeFont(options.font);
  settings.legend = displayLegend(settings);
  settings.drawingArea = getSquareDrawingArea(settings);

  settings.radius = {};
  settings.radius.inner = 0;
  settings.radius.outer = settings.drawingArea.radius * 0.8;
  settings.radius.base = getBaseRadius(settings);

  displayData(settings);
};