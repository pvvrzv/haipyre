import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI, THREE_QUARTER_PI } from '../core/defaults.js';
import { getRadarDataLimits } from '../core/data.js';
import { getBaseRadius } from '../core/helpers.js';
import { polarToCartesian } from '../core/math.js';
import Arc from '../elements/arc.js';
import { displayEntryDetails, getHandler } from '../core/events.js';

const getRadarChart = (ctx, legend, settings, root) => {
  const MARKER_RADIUS = 5;
  const MARKER_DIAMETER = MARKER_RADIUS * 2;
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const step = DOUBLE_PI / settings.dataset.radarLabels.length;
  const data = settings.dataset.data;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: 0,
        outer: r,
        base: getBaseRadius({ inner: 0, outer: r }, settings.limits),
      },
      startAngle: -HALF_PI,
      endAngle: THREE_QUARTER_PI,
      visible: false,
    },
    {
      role: 'chart',
    }
  );

  let i = 0;
  let j = 0;

  while (i < data.length) {
    let angle = -HALF_PI;

    while (j < settings.dataset.radarLabels.length) {
      const dataUnit = data[i];
      const ratio = dataUnit.value[j] / settings.limits.distance;
      const r = ratio * chart.radius.outer + chart.radius.base;
      const coordinates = polarToCartesian(angle, chart.origin, [r]);

      const marker = new Arc(
        {
          origin: coordinates[0],
          radius: {
            inner: 0,
            outer: MARKER_RADIUS,
          },
          startAngle: 0,
          endAngle: DOUBLE_PI,
        },
        {
          role: 'radarChartMarker',
          value: dataUnit.value[j],
          label: dataUnit.label,
        },
        {
          background: dataUnit.background || settings.style.data.background,
          border: dataUnit.border || settings.style.data.border,
        }
      );

      marker.onMouseEnter = () => {
        displayEntryDetails(ctx, marker.origin, marker, settings.font);
      };

      marker.onMouseLeave = () => {
        root.clear(ctx);
        root.render(ctx);
      };

      chart.addChild(marker);

      angle += step;
      j++;
    }

    j = 0;
    i++;
  }

  return chart;
};

export default class Radar extends Radial {
  constructor(canvas, options) {
    super(canvas, options);

    this.TYPE = 3;

    this.chart = getRadarChart(this.ctx, this.legend, this.settings, this.root);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }
}

Radar.prototype._getDataLimits = getRadarDataLimits;
