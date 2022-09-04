import Radial from './radial.js'
import { DOUBLE_PI, HALF_PI, THREE_HALFS_PI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { getBaseRadius } from '../core/helpers.js';
import { renderDiscSegment, fill, stroke, setStrokeStyle, setFillStyle, beginPath } from '../core/canvas.js';
import Arc from '../elements/arc.js';
import { getEventListener } from '../core/events.js';

const getPolarChart = (ctx, legend, settings) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = settings.dataset.data;
  const step = DOUBLE_PI / data.length;
  const BASELINE = 20;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 30],
      radius: {
        inner: 0,
        outer: r,
        base: getBaseRadius({ innter: 0, outer: r }, settings.limits),
      },
      startAngle: -HALF_PI,
      endAngle: THREE_HALFS_PI,
      visible: false
    },
    {
      role: 'chart'
    }
  );

  let sa = -HALF_PI;
  let ea = 0;
  let i = 0;

  while (i < data.length) {
    const ratio = data[i].val / settings.limits.distance;
    const r = ratio * chart.radius.outer + chart.radius.base;
    ea = sa + step;

    const segment = new Arc(
      {
        origin: chart.origin,
        radius: {
          inner: 0,
          outer: r
        },
        startAngle: sa,
        endAngle: ea,
      },
      {
        role: 'PolarChartSegmeng',
        value: data[i].val
      },
      {
        background: data[i].background || settings.colorScheme.data.background,
        border: '#fff'
      }
    );

    chart.addChild(segment);

    i++;
    sa = ea;
  }

  chart.render(ctx);

  return chart;
};

export default class Polar extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.settings.TYPE = '0';

    this.chart = getPolarChart(this.ctx, this.legend, this.settings);
    this.om.addChild(this.chart);

    this.canvas.addEventListener('mousemove', getEventListener(this));
  }
}

Polar.prototype._getDataLimits = getDataLimits;