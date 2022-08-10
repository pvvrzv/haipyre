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
  constructor(origin, width, height, meta, colorScheme) {
    super();

    this.width = width;
    this.height = height;
    this.colorSheme = colorScheme;
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

    if (!this.children) return;
    this.children.forEach((child) => { child.scale(factor) });
  }

  translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;

    if (!this.children) return;
    this.children.forEach((child) => { child.translate(x, y) });
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