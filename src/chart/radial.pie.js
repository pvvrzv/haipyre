import Chart from './radial.js';
import { PI, doublePI, halfPI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { renderDiscSegment, fill, stroke, setStrokeStyle, setFillStyle, beginPath } from '../core/canvas.js';
import { abs } from '../core/utils.js';

const displayData = (settings) => {
  let startAngle = -halfPI;
  let ratio = 0;
  let angle = 0;
  let i = 0;
  setStrokeStyle(settings.ctx, settings.colorScheme.background);

  while (i < settings.dataset.data.length) {
    ratio = abs(settings.dataset.data[i].val) / settings.sum;
    angle = doublePI * ratio + startAngle;

    beginPath(settings.ctx);
    renderDiscSegment(settings.ctx, settings.drawingArea.center, settings.radius.outer, startAngle, angle);

    setFillStyle(settings.ctx, settings.dataset.data[i].background || settings.colorScheme.data.background);
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

Pie.prototype._getDataLimits = () => { };