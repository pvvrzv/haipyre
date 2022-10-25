import { setCanvas, setFont } from '../core/canvas.js';
import { getGlobalStyle } from '../core/style.js';
import { normalizeFont } from '../core/font.js';
import { createLegend } from '../core/legend.js';
import Rectangle from '../elements/rectangle.js';
import { getLegendSettings } from '../core/legend.js';
import { getHandler } from '../core/events.js';

function createRoot(settings) {
  return new Rectangle(
    {
      origin: [0, 0],
      width: settings.width,
      height: settings.height,
    },
    {
      role: 'drawingArea',
    },
    {
      background: settings.style.background,
      border: 'transparent',
    }
  );
}

export default class Chart {
  constructor(canvas, dataset, parameters) {
    this.settings = {};

    this.dataset = dataset;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.settings.dpr = window.devicePixelRatio || 1;
    [this.settings.width, this.settings.height] = setCanvas(this.canvas, this.ctx, this.settings);

    this.settings.font = normalizeFont(parameters.font, this.ctx);
    this.settings.limits = this._getDataLimits(this.dataset);
    this.settings.style = getGlobalStyle(parameters.style);
    this.settings.legend = getLegendSettings(this.settings, parameters);

    this.root = createRoot(this.settings);
    this.legend = createLegend(this.ctx, this.dataset.data, this.settings);
    this.chart = this._createChart(this);
    this.root.addChild(this.legend);
    this.root.addChild(this.chart);
    this.root.render(this.ctx);

    this.canvas.addEventListener('mousemove', getHandler(this.root));
  }

  _getDataLimits() {
    throw new Error('Call for an abstract method!');
  }

  _createChart() {
    throw new Error('Call for an abstract method! Each chart must implement their own _createChart method!');
  }
}
