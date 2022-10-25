import Radial from './radial.js';
import { getDataLimits } from '../../core/data.js';
import { getBaseRadius } from '../../core/helpers.js';
import Arc from '../../elements/arc.js';
import { getHandler } from '../../core/events.js';
import { displayEntryDetails } from '../../core/events.js';
import { TAU, HALF_PI, THREE_HALVES_PI, polarToCartesian } from '../../core/math.js';

const createPolarChart = (chart) => {
  const width = chart.settings.width;
  const height = chart.settings.height - chart.legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = chart.dataset.data;
  const step = TAU / data.length;
  const BASELINE = 20;

  const _chart = new Arc(
    {
      origin: [(width - d) / 2 + r, chart.legend.diagonal[1] + r],
      radius: {
        inner: 0,
        outer: r,
        base: getBaseRadius({ inner: 0, outer: r }, chart.settings.limits),
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
    const ratio = data[i].value / chart.settings.limits.distance;
    const r = ratio * _chart.radius.outer + _chart.radius.base;
    ea = sa + step;

    const segment = new Arc(
      {
        origin: _chart.origin,
        radius: {
          inner: 0,
          outer: r,
        },
        angle: {
          start: sa,
          end: ea,
        },
      },
      {
        role: 'PolarChartSegmeng',
        value: data[i].value,
        label: data[i].label,
      },
      {
        background: data[i].style.background || chart.settings.style.data.background,
        border: '#fff',
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

    _chart.addChild(segment);

    i++;
    sa = ea;
  }

  return _chart;
};

export default class Polar extends Radial {
  TYPE = 'polar';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);
  }
}

Polar.prototype._getDataLimits = getDataLimits;
Polar.prototype._createChart = createPolarChart;
