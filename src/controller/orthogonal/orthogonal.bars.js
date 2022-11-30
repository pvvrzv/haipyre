import Controller from '../controller.js';
import { getRadarDataLimits } from '../../core/data.js';
import Rectangle from '../../elements/rectangle.js';

function getBarsChart(chart) {
  const _chart = new Rectangle(
    {
      origin: [0, 0],
      width: 0,
      height: 0,
    },
    {},
    {}
  );

  return _chart;
}

export default class Bars extends Controller {
  constructor(canvas, dataset, options) {
    super(canvas, dataset, options);
  }
}

Bars.prototype._prepareData = getRadarDataLimits;
Bars.prototype._createChart = getBarsChart;
