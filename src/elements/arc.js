import { TreeNode } from '../utils/tree.js';
import { getVectorAngle } from '../utils/utils.js';


export default class Arc extends TreeNode {
  constructor(origin, radius, sa, ea, meta, colorScheme = {}) {
    super();

    this.origin = origin;
    this.radius = radius;
    this.startAngle = sa;
    this.endAngle = ea;
    this.colorScheme = colorScheme;
    this.meta = meta;
  }

  scale(factor) {
    this.radius *= factor;

    if (!this.children) return;
    this.children.forEach((child) => { child.scale(factor) });
  }

  translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;

    if (!this.children) return;
    this.children.forEach((child) => { child.translate(x, y) });
  }

  moveTo(x, y) {
    this.origin[0] = x || this.origin[0];
    this.origin[1] = y || this.origin[1];

    if (!this.children) return;
    this.children.forEach((child) => { child.moveTo(x, y) });
  }

  intersectsAngle(point) {
    const angle = getVectorAngle(point, this.origin);
    if (angle => this.startAngle && angle <= this.endAngle) {
      return true;
    }

    return false;
  }

  intersectsRadius(point) {
    if (Math.hypot(...point) <= this.radius) {
      return true;
    }
    return false;
  }
}