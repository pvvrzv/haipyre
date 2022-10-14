import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI, THREE_QUARTER_PI } from '../core/defaults.js';
import { abs, polarToCartesian } from '../core/math.js';
import Arc from '../elements/arc.js';
import { getHandler, displayEntryDetails } from '../core/events.js';

const INNER_TO_OUTER_RADIUS_RATIO = 0.3;

const getPieChart = (legend, settings, ctx, root) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = settings.dataset.data;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: r * INNER_TO_OUTER_RADIUS_RATIO,
        outer: r,
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
    const ratio = abs(data[i].val) / settings.limits.sum;
    ea = sa + DOUBLE_PI * ratio;

    const segment = new Arc(
      {
        origin: chart.origin,
        radius: {
          inner: chart.radius.outer * INNER_TO_OUTER_RADIUS_RATIO,
          outer: chart.radius.outer,
        },
        startAngle: sa,
        endAngle: ea,
      },
      {
        role: 'dataEntry',
        value: data[i].val,
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

    sa = ea;
    i++;
  }

  return chart;
};

export default class Pie extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.settings.TYPE = '1';

    this.settings.sum = this.settings.dataset.data.reduce((a, b) => a + abs(b.val), 0);
    this.chart = getPieChart(this.legend, this.settings, this.ctx, this.root);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }
}

Pie.prototype._getDataLimits = (dataset) => {
  const sum = dataset.data.reduce((a, e) => a + abs(e.val), 0);
  return {
    sum,
  };
};
