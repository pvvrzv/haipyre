import Chart from './radial.js';

import { DOUBLE_PI, PI, HALF_PI, THREE_HALFS_PI } from '../core/defaults.js';
import { getRadarDataLimits } from '../core/data.js';
import { normalizeFont, setCanvas, getColorScheme, getBaseRadius } from '../core/helpers.js';
import { fill, stroke, renderPolygon, moveTo, lineTo, closePath, beginPath, setStrokeStyle, setFillStyle, fillPath, strokePath, renderCircle, strokeRect, fillRect } from '../core/canvas.js';
import { abs, polarToCartesian } from '../utils/utils.js';
import Element from '../elements/abstract.js';
import Arc from '../elements/arc.js';
import Rectangle from '../elements/rectangle.js';

const getRadarChart = (ctx, legend, settings) => {
  const MARKER_RADIUS = 5;
  const MARKER_DIAMETER = MARKER_RADIUS * 2;
  const width = settings.width;
  const height = settings.height - legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const step = DOUBLE_PI / settings.dataset.radarLabels;
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
  let angle = -HALF_PI;

  while (i < data.length) {
    const dataUnit = data[i];

    while (j < dataUnit.length) {
      const ratio = dataUnit.val[j] / settings.limits.distance;
      const r = ratio * chart.radius.outer + chart.radius.base;
      const coordinates = polarToCartesian(angle, chart.origin, [r]);

      const marker = new Arc(
        {
          origin: [],
          radius: {
            inner: 0,
            outer: MARKER_RADIUS,
          }
        },
        {
          role: 'marker'
        }
      )

      j++;
    }

    i++;
  }

  return chart;
};

const displayLayout = (settings) => {
  const pointCoordinates = getPointCoordinates(settings);

  displayBackground(settings);
  displayData(settings, pointCoordinates);
};

export default class Radar extends Chart {

  constructor(canvas, options) {
    super(canvas, options);

    this.TYPE = 3;

    this.chart = getRadarChart(this.ctx, this.legend, this.settings);
  }

  resize() {

  }
}

Radar.prototype._getDataLimits = getRadarDataLimits;