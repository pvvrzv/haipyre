import Element from './abstract.js';
import { getVectorAngle, subtractVectors } from '../utils/utils.js';
import { DOUBLE_PI, HALF_PI } from '../core/defaults.js';
import { clampNumber } from '../core/helpers.js';
import {
  beginPath,
  fill,
  renderCircleSegment,
  renderDiscSegment,
  setFillStyle,
  setStrokeStyle,
  stroke,
} from '../core/canvas.js';

const ANGLE_SHIFT = -HALF_PI;

export default class Arc extends Element {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this.startAngle = parameters.startAngle;
    this.endAngle = parameters.endAngle;

    this.radius = parameters.radius;
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
    const alpha = clampNumber(this.endAngle - angle, DOUBLE_PI);
    const betha = clampNumber(this.endAngle - this.startAngle, DOUBLE_PI);

    return alpha <= betha;
  }

  intersectsRadius(radius) {
    return radius >= this.radius.inner && radius <= this.radius.outer;
  }

  _render(ctx) {
    beginPath(ctx);
    setFillStyle(ctx, this.style.background);
    setStrokeStyle(ctx, this.style.border);

    if (this.radius.inner > 0)
      renderCircleSegment(ctx, this.origin, this.radius.outer, this.radius.inner, this.startAngle, this.endAngle);
    else renderDiscSegment(ctx, this.origin, this.radius.outer, this.startAngle, this.endAngle);

    fill(ctx);
    stroke(ctx);
  }
}
