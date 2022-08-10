import { setCanvas, getColorScheme, normalizeFont, getSquareDrawingArea } from "../core/helpers.js";
import { getLegend } from "../core/legend.js";

export default class Chart {
  constructor(canvas, options) {
    this.settings = Object.assign({}, options);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.settings.dpr = window.devicePixelRatio || 1;
    this.settings.limits = this._getDataLimits(options.dataset);
    [this.settings.width, this.settings.height] = setCanvas(this.canvas, this.ctx, this.settings);
    this.settings.colorScheme = getColorScheme(options.colorScheme);
    this.settings.font = normalizeFont(options.font);
    this.settings.legend = getLegend(this.ctx, this.settings);
    // this.settings.drawingArea = getSquareDrawingArea(this.settings);
  }

  _getDataLimits() {
    throw new Error('Call for an abstract method!');
  };
};  