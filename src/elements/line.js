import Element from './element.js';
import {
  beginPath,
  moveTo,
  lineTo,
  setFillStyle,
  fill,
} from '../core/canvas.js';

class Line extends Element {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this.end = parameters.end;
  }

  _scale(factor) {
    this.end = this.end.map((c, i) => c * factor - this.origin[i]);
  }

  _translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;
    this.end[0] += x;
    this.end[1] += y;
  }

  _moveTo(x, y) {
    this.origin[0] = x;
    this.origin[1] = y;
  }

  _render(ctx) {
    beginPath(ctx);
    setFillStyle(this.style.background);
    moveTo(ctx, this.origin);
    lineTo(ctx, this.end);
    fill(ctx);
  }
}
