import Rectangle from './rectangle.js';
import { fillText, setFillStyle, setTextBaseLine } from '../core/canvas.js';

export default class Text extends Rectangle {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this.baseline = parameters.baseline;
    this.content = parameters.content;
  }

  _render(ctx) {
    setTextBaseLine(ctx, this.baseline);
    setFillStyle(ctx, this.style.color);
    fillText(ctx, this.content, this.origin);
  }
}
