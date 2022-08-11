import Chart from './radial.js'
import { PI, DOUBLE_PI, HALF_PI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { getBaseRadius } from '../core/helpers.js';
import { abs } from '../utils/utils.js';
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

export default class Polar extends Chart {
  constructor(canvas, options) {
    super(canvas, options);

    this.settings.TYPE = '0';

    this.settings.radius = {};
    this.settings.radius.inner = 0;
    this.settings.radius.outer = this.settings.drawingArea.radius * 0.8;
    this.settings.radius.base = getBaseRadius(this.settings);

    displayData(this.settings);
  }
}

Polar.prototype._getDataLimits = getDataLimits;