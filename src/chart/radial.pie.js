import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI, THREE_HALFS_PI } from '../core/defaults.js';
import { abs } from '../utils/utils.js';
import Arc from '../elements/arc.js';
import { getHandler } from '../core/events.js';
import { fill, roundRect } from '../core/canvas.js';

const getPieChart = (legend, settings) => {
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
        outer: r,
      },
      startAngle: -HALF_PI,
      endAngle: THREE_HALFS_PI,
      visible: false,
    },
    {
      role: 'chart',
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
          inner: chart.radius.outer * 0.3,
          outer: chart.radius.outer,
        },
        startAngle: sa,
        endAngle: ea,
      },
      {
        role: 'PieChartSegment',
        value: data[i].val,
      },
      {
        background: data[i].background || settings.colorScheme.data.background,
        border: '#fff',
      }
    );

    chart.addChild(segment);

    sa = ea;
    i++;
  }

  return chart;
};

export default class Pie extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.settings.TYPE = '1';

    this.settings.sum = this.settings.dataset.data.reduce(
      (a, b) => a + abs(b.val),
      0
    );

    this.chart = getPieChart(this.legend, this.settings);

    this.om.addChild(this.chart);
    this.chart.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this));
  }
}

Pie.prototype._getDataLimits = (dataset) => {
  const sum = dataset.data.reduce((a, e) => a + abs(e.val), 0);
  return {
    sum,
  };
};
