import Chart from './radial.js';
import { PI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { renderDiscSegment, fill, stroke, setStrokeStyle } from '../core/canvas.js';
import { abs } from '../core/utils.js';

const displayData = (settings) => {
  let startAngle = PI * -0.5;
  let ratio = 0;
  let angle = 0;
  let i = 0;
  settings.ctx.strokeStyle = settings.colorScheme.data.border;

  while (i < settings.dataset.data.length) {
    ratio = abs(settings.dataset.data[i].val) / settings.sum;
    angle = 2 * PI * ratio + startAngle;

    settings.ctx.fillStyle = settings.dataset.data[i].color || settings.colorScheme.data.background;
    renderDiscSegment(settings.ctx, settings.drawingArea.center, settings.radius.outer, startAngle, angle);
    fill(settings.ctx);
    stroke(settings.ctx);

    startAngle = angle;
    i++;
  }
};

export default class Pie extends Chart {
  constructor(canvas, options) {
    super(canvas, options)

    this.settings.TYPE = '1';
    this.settings.sum = this.settings.dataset.data.reduce((a, b) => a + abs(b.val), 0);

    this.settings.radius = {};
    this.settings.radius.inner = 0;
    this.settings.radius.outer = this.settings.drawingArea.height / 2;

    displayData(this.settings);
  }
}

Pie.prototype._getDataLimits = getDataLimits;