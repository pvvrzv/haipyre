import Radial from './radial.js';
import { DOUBLE_PI, HALF_PI, THREE_HALFS_PI } from '../core/defaults.js';
import { getRadarDataLimits } from '../core/data.js';
import { getBaseRadius } from '../core/helpers.js';
import { polarToCartesian } from '../utils/utils.js';
import Arc from '../elements/arc.js';
import { getEventListener } from '../core/events.js';

const getRadarChart = (ctx, legend, settings) => {
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
        base: getBaseRadius({ inner: 0, outer: r }, settings.limits)
      },
      startAngle: - HALF_PI,
      endAngle: THREE_HALFS_PI,
    },
    {
      role: 'chart'
    }
  );

  const coordinateSystem = new Element(
    {
      step: step
    },
    {
      role: 'coordinateSystem'
    }
  )

  chart.addShadow(coordinateSystem);

  let i = 0;
  let j = 0;

  while (i < data.length) {
    let angle = -HALF_PI;

    while (j < settings.dataset.radarLabels.length) {
      const dataUnit = data[i];
      const ratio = dataUnit.val[j] / settings.limits.distance;
      const r = ratio * chart.radius.outer + chart.radius.base;
      const coordinates = polarToCartesian(angle, chart.origin, [r]);

      const marker = new Arc(
        {
          origin: coordinates[0],
          radius: {
            inner: 0,
            outer: MARKER_RADIUS
          },
          startAngle: 0,
          endAngle: DOUBLE_PI
        },
        {
          role: 'radarChartMarker',
          value: dataUnit.val[j]
        },
        {
          background: dataUnit.background || settings.colorScheme.data.background
        }
      );

      chart.addChild(marker)

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

    this.chart = getRadarChart(this.ctx, this.legend, this.settings);
    this.om.addChild(this.chart);
    this.chart.render(this.ctx);

    this.canvas.addEventListener('mousemove', getEventListener(this));
  }

}

Radar.prototype._getDataLimits = getRadarDataLimits;