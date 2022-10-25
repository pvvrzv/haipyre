import Radial from './radial.js';
import { getRadarDataLimits } from '../../core/data.js';
import { getBaseRadius } from '../../core/helpers.js';
import { TAU, HALF_PI, THREE_HALVES_PI, polarToCartesian } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { displayEntryDetails, getHandler } from '../../core/events.js';
import { renderDiscSegment } from '../../core/canvas.js';

const getRadarChart = (ctx, dataset, legend, settings, root) => {
  const MARKER_RADIUS = 5;
  const MARKER_DIAMETER = MARKER_RADIUS * 2;
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const step = TAU / dataset.radarLabels.length;
  const data = dataset.data;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, legend.diagonal[1] + r + 10],
      radius: {
        inner: 0,
        outer: r,
        base: getBaseRadius({ inner: 0, outer: r }, settings.limits),
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

  let i = 0;
  let j = 0;

  while (i < data.length) {
    let angle = -HALF_PI;

    while (j < dataset.radarLabels.length) {
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
          angle: {
            start: 0,
            end: TAU,
          },
        },
        {
          role: 'radarChartMarker',
          value: dataUnit.value[j],
          label: dataUnit.label,
        },
        {
          background: dataUnit.style.background || settings.style.data.background,
          border: dataUnit.style.border || settings.style.data.border,
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
  TYPE = 'radar';

  constructor(canvas, dataset, parameters) {
    super(canvas, dataset, parameters);

    this.chart = getRadarChart(this.ctx, this.dataset, this.legend, this.settings, this.root);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }
}

Radar.prototype._getDataLimits = getRadarDataLimits;
