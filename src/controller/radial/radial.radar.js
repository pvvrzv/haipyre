import Radial from './radial.js';
import { getRadarDataLimits } from '../../core/data.js';
import { getBaseRadius } from '../../core/helpers.js';
import { TAU, HALF_PI, THREE_HALVES_PI, polarToCartesian } from '../../core/math.js';
import Arc from '../../elements/arc.js';
import { displayEntryDetails } from '../../events/handler.js';

const createRadarChart = (controller) => {
  const MARKER_RADIUS = 5;
  const MARKER_DIAMETER = MARKER_RADIUS * 2;
  const width = controller.settings.width;
  const height = controller.settings.height - controller.legend.diagonal[1];
  const d = Math.min(width, height) * 0.9;
  const r = d / 2;
  const step = TAU / controller.dataset.radarLabels.length;
  const data = controller.dataset.data;

  const chart = new Arc(
    {
      origin: [(width - d) / 2 + r, controller.legend.diagonal[1] + r + 10],
      radius: {
        inner: 0,
        outer: r,
        base: getBaseRadius({ inner: 0, outer: r }, controller.settings.limits),
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

    while (j < controller.dataset.radarLabels.length) {
      const dataUnit = data[i];
      const ratio = dataUnit.value[j] / controller.settings.limits.distance;
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
          background: dataUnit.style.background || chartsettings.style.data.background,
          border: dataUnit.style.border || chartsettings.style.data.border,
        }
      );

      marker.addEventListener('mouseenter', () => {
        displayEntryDetails(controller.ctx, marker.origin, marker, controller.settings.font);
      });

      marker.addEventListener('mouseleave', () => {
        controller.root.clear(controller.ctx);
        controller.root.render(controller.ctx);
      });

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
  }
}

Radar.prototype._prepareData = getRadarDataLimits;
Radar.prototype._createChart = createRadarChart;
