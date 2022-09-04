import { TreeNode } from '../utils/tree.js';
import { getVectorAngle, moveVectorOrigin } from '../utils/utils.js';
import { beginPath, fill, renderCircleSegment, renderDiscSegment, setFillStyle, setStrokeStyle, stroke } from '../core/canvas.js';


export default class Arc extends TreeNode {
  constructor(parameters, meta = {}, style = {}) {
    super(meta);

    this.origin = parameters.origin;
    this.startAngle = parameters.startAngle;
    this.endAngle = parameters.endAngle;
    this.style = style;
    this.radius = parameters.radius;
    this.visible = parameters.visible === undefined ? true : parameters.visible;
  }

  scale(factor) {
    this.radius *= factor;

    if (this.children) {
      this.children.forEach((node) => { node.scale(scale) });
    }

    if (this.shadow) {
      this.shadow.forEach((node) => { node.scale(scale) });
    }
  }

  translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;

    if (this.children) {
      this.children.forEach((node) => { node.translate(x, y) });
    }

    if (this.shadow) {
      this.shadow.forEach((node) => { node.translate(x, y) });
    }
  }

  moveTo(x = 0, y = 0) {
    this.origin[0] = x;
    this.origin[1] = y;

    if (this.children) {
      this.children.forEach((node) => { node.moveTo(x, y) });
    }

    if (this.shadow) {
      this.shadow.forEach((node) => { node.moveTo(x, y) });
    }
  }

  intersects(point) {
    const relativePoint = moveVectorOrigin(point, this.origin);
    const radius = Math.hypot(...relativePoint);
    const angle = getVectorAngle(relativePoint);

    return this.intersectsRadius(radius) && this.intersectsAngle(angle);
  }

  intersectsAngle(angle) {
    return angle >= this.startAngle && angle <= this.endAngle;
  }

  intersectsRadius(radius) {
    return radius >= this.radius.inner && radius <= this.radius.outer;
  }

  render(ctx) {
    if (this.visible) {
      beginPath(ctx);
      setFillStyle(ctx, this.style.background);
      setStrokeStyle(ctx, this.style.border);

      if (this.radius.inner > 0) renderCircleSegment(ctx, this.origin, this.radius.outer, this.radius.inner, this.startAngle, this.endAngle);
      else renderDiscSegment(ctx, this.origin, this.radius.outer, this.startAngle, this.endAngle);

      fill(ctx);
      stroke(ctx);
    }

    if (this.children) this.children.forEach((element) => element.render(ctx));
    if (this.shadow) this.shadow.forEach((element) => element.render(ctx));
  }
}