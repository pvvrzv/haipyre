import { setCanvas, getColorScheme, normalizeFont, getSquareDrawingArea } from "../core/helpers.js";
import { displayLegend } from "../core/layout.js";

export default class Chart {
  constructor(canvas, options) {
    this.settings = Object.assign({}, options);

    this.settings.canvas = canvas;
    this.settings.ctx = canvas.getContext('2d');
    this.settings.dpr = window.devicePixelRatio || 1;
    this.settings.limits = this._getDataLimits(options.dataset);
    [this.settings.width, this.settings.height] = setCanvas(this.settings);
    this.settings.colorScheme = getColorScheme(options.colorScheme);
    this.settings.font = normalizeFont(options.font);
    this.settings.legend = displayLegend(this.settings);
    this.settings.drawingArea = getSquareDrawingArea(this.settings);
  }

  _getDataLimits() {
    throw new Error('Call for an abstract method!');
  };
};  