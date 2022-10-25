import Element from './abstract.js';
import { TAU, HALF_PI, getVectorAngle, subtractVectors, clampNumber } from '../core/math.js';
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

const ANGLE_SHIFT = -HALF_PI;

export default class Arc extends Element {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this.angle = {
      start: parameters.angle.start,
      end: parameters.angle.end,
      diff: clampNumber(parameters.angle.end - parameters.angle.start, TAU),
    };

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
    const alpha = clampNumber(this.angle.end - angle, TAU);
    return alpha <= this.angle.diff;
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
      if (this.angle.end === TAU) {
        renderCircle(ctx, this.origin, this.radius.outer);
      } else {
        renderDiscSegment(ctx, this.origin, this.radius.outer, this.angle.start, this.angle.end);
      }
    }
    fill(ctx);
    stroke(ctx);
  }
}
