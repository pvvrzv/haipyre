import { TreeNode } from '../utils/tree.js';
import { getVectorAngle } from '../utils/utils.js';


export default class Arc extends TreeNode {
  constructor(origin, radius, sa, ea, colorScheme, meta = {}) {
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
  }

  translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;
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