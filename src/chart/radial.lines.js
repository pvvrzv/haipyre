import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { abs, polarToCartesian } from '../utils/utils.js';
import Arc from '../elements/arc.js';
import { displayEntryDetails, getHandler } from '../core/events.js';

const getLineChart = (ctx, legend, settings, root) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = settings.dataset.data;
  const absMax = Math.max(settings.limits.max, abs(settings.limits.min));
  const lineWidth = (r / data.length) * 0.9;
  const linePadding = (r / data.length) * 0.1;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: 0,
        outer: r,
      },
      startAngle: 0,
      endAngle: DOUBLE_PI,
      visible: false,
    },
    {
      role: 'chart',
    },
    {}
  );

  const sa = -HALF_PI;
  let outer = chart.radius.outer;
  let inner = outer - lineWidth;
  let ea = 0;
  let i = 0;

  while (i < data.length) {
    const ratio = data[i].val / absMax;
    ea = sa + DOUBLE_PI * ratio;

    const segment = new Arc(
      {
        origin: chart.origin,
        radius: {
          inner: inner,
          outer: outer,
        },
        startAngle: Math.min(sa, ea),
        endAngle: Math.max(sa, ea),
      },
      {
        role: 'dataEntry',
        value: data[i].val,
        label: data[i].label,
      },
      {
        background: data[i].background || settings.style.data.background,
        border: 'transparent',
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

    i++;
    outer -= lineWidth + linePadding;
    inner = outer - lineWidth;
    chart.addChild(segment);
  }

  return chart;
};

export default class Lines extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.TYPE = 2;

    this.chart = getLineChart(this.ctx, this.legend, this.settings, this.root);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }
}

Lines.prototype._getDataLimits = getDataLimits;
