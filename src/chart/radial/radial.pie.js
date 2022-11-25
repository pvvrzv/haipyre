import Radial from './radial.js';
import { TAU, HALF_PI, THREE_HALVES_PI, abs, polarToCartesian } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { prepareData } from '../../core/data.js';
import { displayEntryDetails } from '../../events/handler.js';

const INNER_TO_OUTER_RADIUS_RATIO = 0.3;

const createPieChart = (chart) => {
  const width = chart.settings.width;
  const height = chart.settings.height - chart.legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = chart.dataset.data;

  const _chart = new Arc(
    {
      origin: [(width - d) / 2 + r, chart.legend.diagonal[1] + r + 10],
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

  console.log(chart.settings.data.sum.unsigned);

  while (i < data.length) {
    const ratio = abs(data[i].value) / chart.settings.data.sum.unsigned;
    ea = sa + TAU * ratio;

    const segment = new Arc(
      {
        origin: _chart.origin,
        radius: {
          inner: _chart.radius.outer * INNER_TO_OUTER_RADIUS_RATIO,
          outer: _chart.radius.outer,
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
        background: data[i].style.background || chart.settings.style.data.background,
        border: chart.settings.style.background,
      }
    );

    segment.addEventListener('mouseenter', () => {
      const median = (segment.angle.start + segment.angle.end) / 2;
      const middle = (segment.radius.inner + segment.radius.outer) / 2;
      const center = polarToCartesian(median, segment.origin, [middle])[0];
      displayEntryDetails(chart.ctx, center, segment, chart.settings.font);
    });

    segment.addEventListener('mouseleave', () => {
      chart.root.clear(chart.ctx);
      chart.root.render(chart.ctx);
    });

    _chart.addChild(segment);

    sa = ea;
    i++;
  }

  return _chart;
};

export default class Pie extends Radial {
  TYPE = 'pie';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);
  }
}

Pie.prototype._prepareData = prepareData;
Pie.prototype._createChart = createPieChart;
