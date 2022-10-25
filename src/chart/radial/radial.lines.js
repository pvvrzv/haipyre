import Radial from './radial.js';
import { getDataLimits } from '../../core/data.js';
import { TAU, HALF_PI, abs, polarToCartesian } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { displayEntryDetails, getHandler } from '../../core/events.js';

const createLineChart = (chart) => {
  const width = chart.settings.width;
  const height = chart.settings.height - chart.legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = chart.dataset.data;
  const absMax = Math.max(chart.settings.limits.max, abs(chart.settings.limits.min));
  const lineWidth = (r / data.length) * 0.9;
  const linePadding = (r / data.length) * 0.1;

  const _chart = new Arc(
    {
      origin: [(width - d) / 2 + r, chart.legend.diagonal[1] + r + 10],
      radius: {
        inner: 0,
        outer: r,
      },
      angle: {
        start: 0,
        end: TAU,
      },
      visible: false,
    },
    {
      role: 'chart',
    },
    {}
  );

  const sa = -HALF_PI;
  let outer = _chart.radius.outer;
  let inner = outer - lineWidth;
  let ea = 0;
  let i = 0;

  while (i < data.length) {
    const ratio = data[i].value / absMax;
    ea = sa + TAU * ratio;

    const segment = new Arc(
      {
        origin: _chart.origin,
        radius: {
          inner: inner,
          outer: outer,
        },
        angle: {
          start: sa,
          end: ea,
        },
        counterclockwise: ea < sa,
      },
      {
        role: 'dataEntry',
        value: data[i].value,
        label: data[i].label,
      },
      {
        background: data[i].style.background || chart.settings.style.data.background,
        border: 'transparent',
      }
    );

    segment.onMouseEnter = () => {
      const median = (segment.angle.start + segment.angle.end) / 2;
      const middle = (segment.radius.inner + segment.radius.outer) / 2;
      const center = polarToCartesian(median, segment.origin, [middle])[0];
      displayEntryDetails(chart.ctx, center, segment, chart.settings.font);
    };

    segment.onMouseLeave = () => {
      chart.root.clear(chart.ctx);
      chart.root.render(chart.ctx);
    };

    i++;
    outer -= lineWidth + linePadding;
    inner = outer - lineWidth;
    _chart.addChild(segment);
  }

  return _chart;
};

export default class Lines extends Radial {
  TYPE = 'lines';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);
  }
}

Lines.prototype._getDataLimits = getDataLimits;
Lines.prototype._createChart = createLineChart;
