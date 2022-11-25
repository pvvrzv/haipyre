import Element from './element.js';
import { TAU, HALF_PI, getVectorAngle, subtractVectors, fractionReminder } from '../core/math.js';
import {
  beginPath,
  fill,
  renderCircle,
  renderCircleSegment,
  renderDiscSegment,
  setFillStyle,
  setStrokeStyle,
  stroke,
} from '../core/canvas.js';

export default class Arc extends Element {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this._angle = {};
    this.radius = parameters.radius;
    [this._angle.start, this._angle.end] = parameters.counterclockwise
      ? [parameters.angle.end, parameters.angle.start]
      : [parameters.angle.start, parameters.angle.end];
    this._calculateAngleDiff();
  }

  set angle(angle) {
    this._angle = angle;
    this._calculateAngleDiff();
  }

  get angle() {
    return this._angle;
  }

  _calculateAngleDiff() {
    this._angle.diff = fractionReminder(this._angle.end - this._angle.start, TAU);
  }

  _scale(factor = 1) {
    this.radius.outer *= factor;
    this.radius.inner *= factor;
    this.radius.base *= factor;
  }

  _translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;
  }

  _moveTo(x = 0, y = 0) {
    this.origin[0] = x;
    this.origin[1] = y;
  }

  intersects(point) {
    const relativePoint = subtractVectors(point, this.origin);
    const radius = Math.hypot(...relativePoint);
    const angle = getVectorAngle(relativePoint);

    return this.intersectsRadius(radius) && this.intersectsAngle(angle);
  }

  intersectsAngle(angle) {
    const alpha = fractionReminder(this._angle.end - angle, TAU);
    return alpha <= this._angle.diff;
  }

  intersectsRadius(radius) {
    return radius >= this.radius.inner && radius <= this.radius.outer;
  }

  _render(ctx) {
    beginPath(ctx);
    setFillStyle(ctx, this.style.background);
    setStrokeStyle(ctx, this.style.border);

    if (this.radius.inner > 0) {
      renderCircleSegment(ctx, this.origin, this.radius.outer, this.radius.inner, this.angle.start, this.angle.end);
    } else {
      renderDiscSegment(ctx, this.origin, this.radius.outer, this.angle.start, this.angle.end);
    }

    stroke(ctx);
    fill(ctx);
  }
}
