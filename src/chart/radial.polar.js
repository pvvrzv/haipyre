import Radial from './radial.js';
import { getDataLimits } from '../core/data.js';
import { getBaseRadius } from '../core/helpers.js';
import Arc from '../elements/arc.js';
import { getHandler } from '../core/events.js';
import { displayEntryDetails } from '../core/events.js';
import { DOUBLE_PI, HALF_PI, THREE_QUARTER_PI, polarToCartesian } from '../core/math.js';

const getPolarChart = (ctx, legend, settings, root) => {
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
      endAngle: THREE_QUARTER_PI,
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
    const ratio = data[i].value / settings.limits.distance;
    const r = ratio * chart.radius.outer + chart.radius.base;
    ea = sa + step;

    const segment = new Arc(
      {
        origin: chart.origin,
        radius: {
          inner: 0,
          outer: r,
        },
        startAngle: sa,
        endAngle: ea,
      },
      {
        role: 'PolarChartSegmeng',
        value: data[i].value,
        label: data[i].label,
      },
      {
        background: data[i].background || settings.style.data.background,
        border: '#fff',
      }
    );

    segment.onMouseEnter = () => {
      const median = (segment.startAngle + segment.endAngle) / 2;
      const middle = (segment.radius.inner + segment.radius.outer) / 2;
      const center = polarToCartesian(median, segment.origin, [middle])[0];
      displayEntryDetails(ctx, center, segment, settings.font);
    };

    segment.onMouseLeave = () => {
      root.clear(ctx);
      root.render(ctx);
    };

    chart.addChild(segment);

    i++;
    sa = ea;
  }

  return chart;
};

export default class Polar extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.settings.TYPE = '0';

    this.chart = getPolarChart(this.ctx, this.legend, this.settings, this.root);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }
}

Polar.prototype._getDataLimits = getDataLimits;
