import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI, THREE_HALFS_PI } from '../core/defaults.js';
import { getDataLimits } from '../core/data.js';
import { abs } from '../utils/utils.js';
import Arc from '../elements/arc.js';

const getLineChart = (ctx, legend, settings) => {
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const data = settings.dataset.data;
  const absMax = Math.max(settings.limits.max, abs(settings.limits.min));
  const lineWidth = r / data.length * 0.9;
  const linePadding = r / data.length * 0.1

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: 0,
        outer: r,
      },
      startAngle: - HALF_PI,
      endAngle: THREE_HALFS_PI,
      visible: false
    },
    {
      role: 'chart'
    },
    {
    }
  );

  let outer = chart.radius.outer;
  let inner = outer - lineWidth;
  let sa = -HALF_PI;
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
          outer: outer
        },
        startAngle: sa > ea ? ea : sa,
        endAngle: sa > ea ? sa : ea
      },
      {
        role: 'LinesChartSegment'
      },
      {
        background: data[i].background || settings.colorScheme.data.background,
        border: 'transparent'
      }
    );

    i++;
    outer -= (lineWidth + linePadding);
    inner = outer - lineWidth;
    chart.addChild(segment);
  }


  return chart;
};

export default class Lines extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.TYPE = 2;

    this.chart = getLineChart(this.ctx, this.legend, this.settings);
    this.chart.render(this.ctx);
  }
}

Lines.prototype._getDataLimits = getDataLimits;