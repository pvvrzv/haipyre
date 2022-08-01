import { PI } from '../core/defaults.js';
import { getDataLimits, normalizeFont, setCanvas, getLegendDimensions, getSquareDrawingAreaDimensions, getColorScheme } from '../core/helpers.js';
import { displayLegend } from '../core/layout.js';
import { renderDiscSegment, fill, stroke, renderCircle, renderCircleSegment, closePath, beginPath } from '../core/canvas.js';
import { abs } from '../core/utils.js';

const displayData = (settings) => {

  let startAngle = PI * - 0.5;
  let r2 = settings.radius.outer;
  let r1 = r2 - settings.line.width;
  let radius = settings.radius.outer - settings.line.width / 2;
  let endAngle = 0;
  let i = 0;

  settings.ctx.strokeStyle = settings.colorScheme.stroke;

  while (i < settings.dataset.data.length) {
    const ratio = settings.dataset.data[i].val / settings.limits.absMax;
    const angle = 2 * PI * ratio;
    endAngle = startAngle + angle;
    
    settings.ctx.fillStyle = settings.dataset.data[i].color || settings.colorScheme.default;
    
    beginPath(settings.ctx);
    renderCircle(settings.ctx, settings.drawingArea.center, radius);
    stroke(settings.ctx);
    
    beginPath(settings.ctx);
    if (settings.dataset.data[i].val > 0) renderCircleSegment(settings.ctx, settings.drawingArea.center, r1, r2, startAngle, endAngle);
    if (settings.dataset.data[i].val <= 0) renderCircleSegment(settings.ctx, settings.drawingArea.center, r1, r2, endAngle, startAngle);
    fill(settings.ctx);
    
    r2 -= settings.radius.step;
    r1 -= settings.radius.step;
    radius -= settings.radius.step;
    i++;
  }
};

export const start = (canvas, options) => {
  const settings = Object.assign({}, options);

  settings.TYPE = 2;
  settings.canvas = canvas;
  settings.ctx = canvas.getContext('2d');
  settings.dpr = window.devicePixelRatio || 1;
  [settings.width, settings.height] = setCanvas(settings.canvas, settings.ctx, settings.dpr);
  settings.colorScheme = getColorScheme(options.colorScheme);

  settings.limits = getDataLimits(options.dataset.data);
  settings.limits.absMax = Math.max(abs(settings.limits.min), settings.limits.max);
  settings.font = normalizeFont(options.font);
  settings.legend = getLegendDimensions(settings);

  settings.legend.height = displayLegend(settings);
  settings.drawingArea = getSquareDrawingAreaDimensions(settings);

  settings.line = {};
  settings.line.width = settings.drawingArea.halfHeight / settings.dataset.data.length * 0.5;

  settings.radius = {};
  settings.radius.inner = settings.drawingArea.halfHeight * 0.1;
  settings.radius.outer = settings.drawingArea.halfHeight;
  settings.radius.distance = settings.radius.outer - settings.radius.inner;
  settings.radius.step = (settings.radius.distance - settings.line.width) / settings.dataset.data.length;


  displayData(settings);
};