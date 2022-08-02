import Chart from './radial.js';

import { PI } from '../core/defaults.js';
import { getRadarDataLimits } from '../core/data.js';
import { normalizeFont, setCanvas, getColorScheme, getBaseRadius, getSquareDrawingArea } from '../core/helpers.js';
import { displayLegend } from '../core/layout.js';
import { fill, stroke, renderPolygon, moveTo, lineTo, closePath, beginPath, setStrokeStyle, setFillStyle, fillPath, strokePath, renderCircle, strokeRect, fillRect } from '../core/canvas.js';
import { abs, polarToCartesian } from '../core/utils.js';

const displayBackground = (settings) => {
  const startAngle = PI * -0.5;
  const angle = 2 * PI / settings.dataset.radarLabels.length;

  settings.ctx.strokeStyle = settings.colorScheme.default;

  renderPolygon(settings.ctx, settings.drawingArea.center, settings.radius.outer, settings.dataset.radarLabels.length, startAngle);

  settings.dataset.radarLabels.forEach((label, i) => {
    const coordinates = polarToCartesian(startAngle + angle * i, settings.drawingArea.center, [settings.radius.outer]);
    moveTo(settings.ctx, settings.drawingArea.center);
    lineTo(settings.ctx, coordinates[0]);
  });

  stroke(settings.ctx);
};

const getPointCoordinates = (settings) => {
  const startAngle = PI * -0.5;
  const angle = PI * 2 / settings.dataset.radarLabels.length;
  const coordinates = [];

  settings.dataset.data.forEach((entry, i) => {
    coordinates[i] = [];

    for (let j = 0; j < settings.dataset.radarLabels.length; j++) {
      if (entry.val[j] === undefined) coordinates[i].push(settings.drawingArea.center);
      const ratio = entry.val[j] / settings.limits.distance;
      const radius = settings.radius.base + settings.radius.outer * ratio;
      const pointCoordinates = polarToCartesian(startAngle + angle * j, settings.drawingArea.center, [radius]);
      coordinates[i].push(pointCoordinates[0]);
    }
  });

  return coordinates;
};

const displayData = (settings, coordinates) => {
  coordinates.forEach((entry, i) => {
    const path = new Path2D();
    moveTo(path, entry[0]);
    setFillStyle(settings.ctx, settings.dataset.data[i].border || settings.colorScheme.border);
    beginPath(settings.ctx);
    renderCircle(settings.ctx, entry[0], 2);
    fill(settings.ctx);

    for (let j = 1; j < entry.length; j++) {
      lineTo(path, entry[j]);
      beginPath(settings.ctx);
      renderCircle(settings.ctx, entry[j], 2);
      fill(settings.ctx);
    };

    closePath(path);
    setFillStyle(settings.ctx, settings.dataset.data[i].background || settings.colorScheme.data.backgroundAlpha);
    setStrokeStyle(settings.ctx, settings.dataset.data[i].border || settings.colorScheme.data.border);
    fillPath(settings.ctx, path);
    strokePath(settings.ctx, path);
  });
};

const displayLayout = (settings) => {
  const pointCoordinates = getPointCoordinates(settings);

  displayBackground(settings);
  displayData(settings, pointCoordinates);
};

export default class Radar extends Chart {

  constructor(canvas, options) {
    super(canvas, options);

    this.TYPE = 3;
    this.settings.radius = {};
    this.settings.radius.inner = 0;
    this.settings.radius.outer = this.settings.drawingArea.height / 2;
    this.settings.radius.base = getBaseRadius(this.settings);

    displayLayout(this.settings);
  }
}

Radar.prototype._setCanvas = setCanvas;
Radar.prototype._getColorScheme = getColorScheme;
Radar.prototype._normalizeFont = normalizeFont;
Radar.prototype._getDataLimits = getRadarDataLimits;
Radar.prototype._drawLegend = displayLegend;
Radar.prototype._getDrawingArea = getSquareDrawingArea;
