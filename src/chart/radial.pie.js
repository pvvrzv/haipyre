import { PI } from '../core/defaults.js';
import { getDataLimits, normalizeFont, setCanvas, getLegendDimensions, getSquareDrawingAreaDimensions, getColorScheme } from '../core/helpers.js';
import { displayLegend } from '../core/layout.js';
import { renderDiscSegment, fill, stroke } from '../core/canvas.js';
import { abs } from '../core/utils.js';

const displayData = (settings) => {
  let startAngle = PI * -0.5;
  let ratio = 0;
  let angle = 0;
  let i = 0;
  settings.ctx.strokeStyle = settings.colorScheme.background;

  while (i < settings.dataset.data.length) {
    ratio = abs(settings.dataset.data[i].val) / settings.sum;
    angle = 2 * PI * ratio + startAngle;

    settings.ctx.fillStyle = settings.dataset.data[i].color || settings.colorScheme.default;
    renderDiscSegment(settings.ctx, settings.drawingArea.center, settings.radius.outer, startAngle, angle);
    fill(settings.ctx);
    stroke(settings.ctx);

    startAngle = angle;
    i++;
  }
};

export const start = (canvas, options) => {
  const settings = Object.assign({}, options);

  settings.TYPE = '1';
  settings.canvas = canvas;
  settings.ctx = canvas.getContext('2d');
  settings.dpr = window.devicePixelRatio || 1;
  [settings.width, settings.height] = setCanvas(settings.canvas, settings.ctx, settings.dpr);
  settings.colorScheme = getColorScheme(options.colorScheme);

  settings.limits = getDataLimits(options.dataset.data);
  settings.sum = settings.dataset.data.reduce((a, b) => a + abs(b.val), 0);
  settings.font = normalizeFont(options.font);
  settings.legend = getLegendDimensions(settings);

  settings.legend.height = displayLegend(settings);
  settings.drawingArea = getSquareDrawingAreaDimensions(settings);

  settings.radius = {};
  settings.radius.inner = 0;
  settings.radius.outer = settings.drawingArea.halfHeight;

  displayData(settings);
};