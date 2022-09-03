import { TreeNode } from '../utils/tree.js';

class Line extends TreeNode {
  constructor(parameters, meta = {}, style = {}) {
    super(meta);

    this.origin = parameters.origin;
    this.end = parameters.end;
    this.style = style;
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

  moveTo(x, y) {
    this.origin[0] = x || this.origin[0];
    this.origin[1] = y || this.origin[1];

    if (!this.children) return;
    this.children.forEach((child) => { child.moveTo(x, y) });
  }
}