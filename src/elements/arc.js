import { TreeNode } from '../utils/tree.js';
import { getVectorAngle, moveVectorOrigin } from '../utils/utils.js';


export default class Arc extends TreeNode {
  constructor(origin, radius, sa, ea, meta = {}, colorScheme = {}) {
    super(meta);

    this.origin = origin;
    this.radius = radius;
    this.startAngle = sa;
    this.endAngle = ea;
    this.colorScheme = colorScheme;
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

  moveTo(x, y) {
    this.origin[0] = x || this.origin[0];
    this.origin[1] = y || this.origin[1];

    if (this.children) {
      this.children.forEach((node) => { node.moveTo(x, y) });
    }

    if (this.shadow) {
      this.shadow.forEach((node) => { node.moveTo(x, y) });
    }
  }

  intersects(point) {
    const relativePoint = moveVectorOrigin(point, this.origin);
    const angle = getVectorAngle(relativePoint);
    return this.intersectsRadius(relativePoint) && this.intersectsAngle(angle);
  }

  intersectsAngle(angle) {
    return angle >= this.startAngle && angle <= this.endAngle;
  }

  intersectsRadius(point) {
    return Math.hypot(...point) <= this.radius;
  }
}