import { TreeNode } from '../utils/tree.js';

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


export default class Rectangle extends TreeNode {
  constructor(origin, width, height, meta, colorScheme = {}) {
    super();

    this.width = width;
    this.height = height;
    this.colorScheme = colorScheme;
    this.meta = meta;
    this.origin = origin;
    this.diagonal = [
      origin[0] + width,
      origin[1] + height
    ];
  };

  scale(factor) {
    this.width *= factor;
    this.heigth *= factor;

    this.diagonal = [
      this.origin[0] + this.width,
      this.origin[1] + this.height
    ];

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

  update(width, height) {
    this.width = width;
    this.height = height;

    this.diagonal = [
      this.origin[0] + width,
      this.origin[1] + height
    ];
  }

  intersects(point) {
    if (
      this.intersectsY(point) &&
      this.intersectsX(point)
    ) {
      return true;
    }
    return false;
  }

  intersectsY(point) {
    if (
      point[1] >= this.origin[1]
      && point[1] <= this.diagonal[1]
    ) {
      return true;
    }
    return false

  }

  intersectsX(point) {
    if (
      point[0] >= this.origin[0]
      && point[0] <= this.diagonal[0]
    ) {
      return true;
    }
    return false
  }
}