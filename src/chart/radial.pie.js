import Chart from './radial.js';
import { PI, DOUBLE_PI, HALF_PI } from '../core/defaults.js';
import { renderDiscSegment, fill, stroke, setStrokeStyle, setFillStyle, beginPath, renderCircle, fillRect } from '../core/canvas.js';
import { abs } from '../utils/utils.js';
import { Tree } from '../utils/tree.js';
import Rectangle from '../elements/rectangle.js';
import Arc from '../elements/arc.js';

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

const getPieChart = (ctx, legend, settings) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.99;
  const r = d / 2;
  const data = settings.dataset.data;

  const chart = new Arc(
    [(width - d) / 2 + r, legend.diagonal[1] + r],
    r,
    0,
    DOUBLE_PI,
    {
      role: 'chart'
    }
  );

  let sa = 0;
  let ea = 0;
  let i = 0;

  while (i < data.length) {
    const ratio = abs(data[i].val) / settings.limits.sum;
    ea = sa + DOUBLE_PI * ratio;

    const segment = new Arc(
      chart.origin,
      chart.radius,
      sa,
      ea,
      {
        role: 'PieChartSegment'
      },
      {
        background: data[i].background || settings.colorScheme.data.background
      }
    );

    chart.addChild(segment);

    sa = ea;
    i++;
  }

  setStrokeStyle(ctx, '#ffffff');
  chart.children.forEach((seg) => {
    beginPath(ctx);
    setFillStyle(ctx, seg.colorScheme.background);
    renderDiscSegment(ctx, seg.origin, seg.radius, seg.startAngle, seg.endAngle, -HALF_PI);
    fill(ctx);
    stroke(ctx);
  });

  return chart;
};

export default class Pie extends Chart {
  constructor(canvas, options) {
    super(canvas, options)

    this.settings.TYPE = '1';

    this.settings.sum = this.settings.dataset.data.reduce((a, b) => a + abs(b.val), 0);

    this.chart = getPieChart(this.ctx, this.legend, this.settings);
  }
}

Pie.prototype._getDataLimits = (dataset) => {
  const sum = dataset.data.reduce((a, e) => a + abs(e.val), 0);
  return {
    sum
  }
};