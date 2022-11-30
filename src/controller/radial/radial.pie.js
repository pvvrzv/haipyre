import Radial from './radial.js';
import { TAU, HALF_PI, THREE_HALVES_PI, abs, polarToCartesian } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { prepareData } from '../../core/data.js';
import { displayEntryDetails } from '../../events/handler.js';

const INNER_TO_OUTER_RADIUS_RATIO = 0.3;

const createDataEntry = (settings, chart, controller) => {
  const data = controller.dataset.data[settings.index];

  const entry = new Arc(
    {
      origin: chart.origin,
      radius: {
        inner: chart.radius.outer * INNER_TO_OUTER_RADIUS_RATIO,
        outer: chart.radius.outer,
      },
      angle: {
        start: settings.angle.start,
        end: settings.angle.end,
      },
    },
    {
      role: 'dataEntry',
      value: data.value,
      label: data.label,
    },
    {
      background: data.style.background || controller.settings.style.data.background,
      border: controller.settings.style.background,
    }
  );

  entry.addEventListener(
    'mouseenter',
    (event) => {
      const median = (entry.angle.start + entry.angle.end) / 2;
      const middle = (entry.radius.inner + entry.radius.outer) / 2;
      const center = polarToCartesian(median, entry.origin, [middle])[0];
      displayEntryDetails(controller.ctx, center, entry, controller.settings.font);
    },
    {
      default: true,
    }
  );

  entry.addEventListener(
    'mouseleave',
    () => {
      controller.root.clear(controller.ctx);
      controller.root.render(controller.ctx);
    },
    { default: true }
  );

  return entry;
};

const createPieChart = (controller) => {
  const width = controller.settings.width;
  const height = controller.settings.height - controller.legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = controller.dataset.data;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, controller.legend.diagonal[1] + r + 10],
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
    const ratio = abs(data[i].value) / controller.settings.data.sum.unsigned;
    ea = sa + TAU * ratio;

    const settings = {
      index: i,
      angle: {
        start: sa,
        end: ea,
      },
    };

    const entry = createDataEntry(settings, chart, controller);

    chart.addChild(entry);

    sa = ea;
    i++;
  }

  return chart;
};

export default class Pie extends Radial {
  TYPE = 'pie';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);
  }
}

Pie.prototype._prepareData = prepareData;
Pie.prototype._createChart = createPieChart;
