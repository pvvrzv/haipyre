import { setCanvas, setFont } from '../core/canvas.js';
import { getGlobalStyle } from '../core/style.js';
import { normalize as normalizeFont } from '../core/font.js';
import { getLegend } from '../core/legend.js';
import Rectangle from '../elements/rectangle.js';

export default class Chart {
  constructor(canvas, options) {
    this.settings = Object.assign({}, options);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.settings.dpr = window.devicePixelRatio || 1;
    this.settings.limits = this._getDataLimits(options.dataset);
    [this.settings.width, this.settings.height] = setCanvas(this.canvas, this.ctx, this.settings);
    this.settings.style = getGlobalStyle(options.style);
    this.settings.font = normalizeFont(options.font);
    setFont(this.ctx, this.settings.font.string);

    this.root = new Rectangle(
      {
        origin: [0, 0],
        width: this.settings.width,
        height: this.settings.height,
      },
      {
        role: 'drawingArea',
      },
      {
        background: this.settings.style.background,
        border: 'transparent',
      }
    );

    this.legend = getLegend(this.ctx, this.settings);
    this.root.addChild(this.legend);
  }

  _getDataLimits() {
    throw new Error('Call for an abstract method!');
  }
}
