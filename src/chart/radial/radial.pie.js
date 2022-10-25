import Radial from './radial.js';
import { TAU, HALF_PI, THREE_HALVES_PI, abs, polarToCartesian } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { getHandler, displayEntryDetails } from '../../core/events.js';

const INNER_TO_OUTER_RADIUS_RATIO = 0.3;

const getPieChart = (legend, dataset, settings, ctx, root) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = dataset;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: r * INNER_TO_OUTER_RADIUS_RATIO,
        outer: r,
      },
      angle: {
        start: -HALF_PI,
        end: THREE_HALVES_PI,
      },
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
    const ratio = abs(data[i].value) / settings.limits.sum;
    ea = sa + TAU * ratio;

    const segment = new Arc(
      {
        origin: chart.origin,
        radius: {
          inner: chart.radius.outer * INNER_TO_OUTER_RADIUS_RATIO,
          outer: chart.radius.outer,
        },
        angle: {
          start: sa,
          end: ea,
        },
      },
      {
        role: 'dataEntry',
        value: data[i].value,
        label: data[i].label,
      },
      {
        background: data[i].style.background || settings.style.data.background,
        border: settings.style.background,
      }
    );

    segment.onMouseEnter = () => {
      const median = (segment.angle.start + segment.angle.end) / 2;
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
  TYPE = 'pie';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);

    this.settings.sum = data.dataset.reduce((a, b) => a + abs(b.val), 0);
    this.chart = getPieChart(this.legend, this.data.dataset, this.settings, this.ctx, this.root);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }
}

Pie.prototype._getDataLimits = (dataset) => {
  const sum = dataset.reduce((a, e) => a + abs(e.value), 0);
  return {
    sum,
  };
};
