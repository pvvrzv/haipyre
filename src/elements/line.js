import { TreeNode } from '../utils/tree.js';

class Line extends TreeNode {
  constructor(origin, end, colorScheme, meta = {}) {
    super();

    this.origin = origin;
    this.end = end;
    this.colorScheme = colorScheme;
    this.meta = meta;
  }

  scale(factor) {
    this.end = this.end.map((c, i) => c * factor - this.origin[i]);
  }

  translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;
    this.end[0] += x;
    this.end[1] += y;
  }
}