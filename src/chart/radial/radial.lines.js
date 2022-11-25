import Radial from './radial.js';
import { prepareData } from '../../core/data.js';
import { TAU, HALF_PI, abs, polarToCartesian, clampNumber, isInSegment } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { displayEntryDetails } from '../../events/handler.js';

const createBackground = (settings, _chart) => {
  return new Arc(
    {
      origin: _chart.origin,
      radius: settings.radius,
      angle: {
        start: 0,
        end: TAU,
      },
    },
    {},
    {
      background: 'rgba(0, 0, 0, 0.05)',
      border: 'transparent',
    }
  );
};

const createPlug = (settings, entry, origin) => {
  return new Arc(
    {
      origin,
      radius: {
        inner: 0,
        outer: settings.lineWidth / 2,
      },
      angle: {
        start: 0,
        end: TAU,
      },
    },
    {},
    {
      background: entry.style.background,
      border: 'transparent',
    }
  );
};

const createVisualEntry = (settings, _chart, entry) => {
  const visualSa = settings.angle.start + settings.half_e * settings.ratioSign;
  const visualEa = settings.angle.end - settings.half_e * settings.ratioSign;

  const visual = new Arc(
    {
      origin: _chart.origin,
      radius: settings.radius,
      angle: {
        start: visualSa,
        end: visualEa,
      },
      counterclockwise: settings.counterclockwise,
    },
    {},
    {
      background: entry.style.background,
      border: 'transparent',
    }
  );

  const startPlugOrigin = polarToCartesian(visual.angle.start, _chart.origin, [settings.radius.middle])[0];
  const endPlugOrigin = polarToCartesian(visual.angle.end, _chart.origin, [settings.radius.middle])[0];
  const plug_start = createPlug(settings, entry, startPlugOrigin);
  const plug_end = createPlug(settings, entry, endPlugOrigin);

  visual.addShadow(plug_start);
  visual.addShadow(plug_end);

  return visual;
};

const createDataEntry = (settings, _chart, chart) => {
  const data = chart.dataset.data[settings.index];

  const entry = new Arc(
    {
      origin: _chart.origin,
      radius: settings.radius,
      angle: {
        start: settings.angle.start,
        end: settings.angle.end,
      },
      counterclockwise: settings.counterclockwise,
      visible: false,
    },
    {
      role: 'dataEntry',
      value: data.value,
      label: data.label,
    },
    {
      background: data.style.background || chart.settings.style.data.background,
      border: 'transparent',
    }
  );

  entry.addEventListener('mouseenter', () => {
    const median = (entry.angle.start + entry.angle.end) / 2;
    const middle = (entry.radius.inner + entry.radius.outer) / 2;
    const center = polarToCartesian(median, entry.origin, [middle])[0];
    displayEntryDetails(chart.ctx, center, entry, chart.settings.font);
  });
  entry.addEventListener('mouseleave', () => {
    chart.root.clear(chart.ctx);
    chart.root.render(chart.ctx);
  });

  if (chart.dataset.onMouseEnter) entry.addEventListener('mouseenter', chart.dataset.onMouseEnter);
  if (chart.dataset.onMouseLeave) entry.addEventListener('mouseleave', chart.dataset.onMouseLeave);

  if (settings.ratio === 1) {
    entry.angle = {
      start: -HALF_PI,
      end: settings.angle.start + TAU,
    };
    entry.visible = true;
    return entry;
  }

  const background = createBackground(settings, _chart);
  entry.addShadow(background);

  if (settings.ratio === 0) {
    entry.angle = {
      start: settings.angle.start,
      end: settings.angle.start + TAU,
    };
    return entry;
  }

  const visual = createVisualEntry(settings, _chart, entry);
  entry.addShadow(visual);

  return entry;
};

const createLineChart = (chart) => {
  const width = chart.settings.width;
  const height = chart.settings.height - chart.legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = chart.dataset.data;
  const lineWidthMultiplyer = 0.7;
  const linePaddingMultiplyer = 1 - lineWidthMultiplyer;
  const lineWidth = (r / data.length) * lineWidthMultiplyer;
  const paddingWidth = (r / data.length) * linePaddingMultiplyer;

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

  let i = 0;

  while (i < data.length) {
    const sa = -HALF_PI;
    const outer = r - (i * lineWidth + i * paddingWidth);
    const inner = outer - lineWidth;
    const middle = inner + (outer - inner) / 2;
    const r2 = 2 * middle ** 2;
    const e = Math.acos((r2 - lineWidth ** 2) / r2);
    const half_e = e / 2;
    const ratio = data[i].value / chart.settings.data.limits.absMax;
    const ratioSign = Math.sign(ratio);
    const counterclockwise = ratio < 0;
    const ea = sa + half_e * ratioSign + (TAU - e) * ratio;

    const entrySettings = {
      ratio,
      ratioSign,
      lineWidth,
      paddingWidth,
      index: i,
      angle: {
        start: sa,
        end: ea,
      },
      radius: {
        outer,
        inner,
        middle,
      },
      e,
      half_e,
      counterclockwise,
    };

    const entry = createDataEntry(entrySettings, _chart, chart);

    i++;
    _chart.addChild(entry);
  }

  return _chart;
};

export default class Lines extends Radial {
  TYPE = 'lines';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);
  }
}

Lines.prototype._prepareData = prepareData;
Lines.prototype._createChart = createLineChart;
