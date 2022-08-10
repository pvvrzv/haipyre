import Chart from './radial.js';
import { PI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { fill, stroke, renderCircle, renderCircleSegment, closePath, beginPath } from '../core/canvas.js';
import { abs } from '../utils/utils.js';

const displayData = (settings) => {

  let startAngle = PI * - 0.5;
  let r2 = settings.radius.outer;
  let r1 = r2 - settings.line.width;
  let radius = settings.radius.outer - settings.line.width / 2;
  let endAngle = 0;
  let i = 0;

  settings.ctx.strokeStyle = settings.colorScheme.stroke;

  while (i < settings.dataset.data.length) {
    const ratio = settings.dataset.data[i].val / abs(settings.limits.max);
    const angle = 2 * PI * ratio;
    endAngle = startAngle + angle;

    settings.ctx.fillStyle = settings.dataset.data[i].color || 'black';

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

export default class Lines extends Chart {
  constructor(canvas, options) {
    super(canvas, options);

    this.TYPE = 2;
    this.settings.line = {};
    this.settings.line.width = (this.settings.drawingArea.height / 2) / this.settings.dataset.data.length * 0.5;

    this.settings.radius = {};
    this.settings.radius.inner = (this.settings.drawingArea.height / 2) * 0.1;
    this.settings.radius.outer = this.settings.drawingArea.height / 2;
    this.settings.radius.distance = this.settings.radius.outer - this.settings.radius.inner;
    this.settings.radius.step = (this.settings.radius.distance - this.settings.line.width) / this.settings.dataset.data.length;

    displayData(this.settings);
  }
}

Lines.prototype._getDataLimits = getDataLimits;
