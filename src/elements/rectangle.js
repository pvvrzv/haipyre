import { beginPath, clearRect, closePath, fillRect, setFillStyle, setStrokeStyle, strokeRect } from '../core/canvas.js';
import Element from './element.js';

// origin
//        +-------+
//        |\      |
//        | \     |
//        |  \    |
//        |   \   |
//        |    \  |
//        |     \ |
//        |      \|
//        +-------+
//                   diagonal

export default class Rectangle extends Element {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this._width = parameters.width;
    this._height = parameters.height;
    this.diagonal = [0, 0];

    this._calculateDiagonal();
  }

  set width(width) {
    this._width = width;
    this._calculateDiagonal();
  }

  get width() {
    return this._width;
  }

  set height(height) {
    this._height = height;
    this._calculateDiagonal();
  }

  get height() {
    return this._height;
  }

  _scale(factor) {
    this.width *= factor;
    this.heigth *= factor;

    this._calculateDiagonal();
  }

  _translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;

    this._calculateDiagonal();
  }

  _moveTo(x = 0, y = 0) {
    this.origin[0] = x;
    this.origin[1] = y;

    this._calculateDiagonal();
  }

  update(width, height) {
    this.width = width;
    this.height = height;

    this._calculateDiagonal();
  }

  clear(ctx) {
    clearRect(ctx, this.origin, this.width, this.height);
  }

  _calculateDiagonal() {
    this.diagonal = [this.origin[0] + this.width, this.origin[1] + this.height];
  }

  intersects(point) {
    return this.intersectsY(point) && this.intersectsX(point);
  }

  intersectsY(point) {
    return point[1] >= this.origin[1] && point[1] <= this.diagonal[1];
  }

  intersectsX(point) {
    return point[0] >= this.origin[0] && point[0] <= this.diagonal[0];
  }

  _render(ctx) {
    beginPath(ctx);
    setFillStyle(ctx, this.style.background);
    setStrokeStyle(ctx, this.style.border);
    strokeRect(ctx, this.origin, this.width, this.height);
    fillRect(ctx, this.origin, this.width, this.height);
  }
}
