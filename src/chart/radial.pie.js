import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI, THREE_HALFS_PI } from '../core/defaults.js';
import { renderDiscSegment, fill, stroke, setStrokeStyle, setFillStyle, beginPath, renderCircle, fillRect, renderCircleSegment, renderRectangle } from '../core/canvas.js';
import { abs, getVectorAngle, moveVectorOrigin } from '../utils/utils.js';
import Arc from '../elements/arc.js';
import { getEventListener } from '../core/events.js';

const getPieChart = (ctx, legend, settings) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = settings.dataset.data;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: r * 0.3,
        outer: r
      },
      startAngle: - HALF_PI,
      endAngle: THREE_HALFS_PI,
    },
    {
      role: 'chart'
    }
  );

  let sa = -HALF_PI;
  let ea = 0;
  let i = 0;

  while (i < data.length) {
    const ratio = abs(data[i].val) / settings.limits.sum;
    ea = sa + DOUBLE_PI * ratio;

    const segment = new Arc(
      {
        origin: chart.origin,
        radius: {
          inner: chart.radius.outer * 0.30,
          outer: chart.radius.outer
        },
        startAngle: sa,
        endAngle: ea,
      },
      {
        role: 'PieChartSegment',
        value: data[i].val
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
    renderCircleSegment(ctx, seg.origin, seg.radius.inner, seg.radius.outer, seg.startAngle, seg.endAngle);
    fill(ctx);
    stroke(ctx);
  });

  return chart;
};

export default class Pie extends Radial {
  constructor(canvas, options) {
    super(canvas, options)

    this.settings.TYPE = '1';

    this.settings.sum = this.settings.dataset.data.reduce((a, b) => a + abs(b.val), 0);

    this.chart = getPieChart(this.ctx, this.legend, this.settings);

    this.om.addChild(this.chart);

    this.canvas.addEventListener('mousemove', getEventListener(this));
  }
}


Pie.prototype._getDataLimits = (dataset) => {
  const sum = dataset.data.reduce((a, e) => a + abs(e.val), 0);
  return {
    sum
  }
};