import { beginPath, fillRect, setFillStyle, setStrokeStyle, strokeRect } from '../core/canvas.js';
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
  constructor(parameters, meta = {}, style = {}) {
    super(meta);

    this.width = parameters.width;
    this.height = parameters.height;
    this.origin = parameters.origin;
    this.visible = parameters.visible === undefined ? true : parameters.visible;
    this.style = style;
    this.diagonal = [0, 0];

    this._calculateDiagonal();
  };

  scale(factor) {
    this.width *= factor;
    this.heigth *= factor;

    this._calculateDiagonal();

    if (this.children) {
      this.children.forEach((node) => { node.scale(factor) });
    }

    if (this.shadow) {
      this.shadow.forEach((node) => { node.scale(factor) });
    }
  }

  translate(x = 0, y = 0) {
    this.origin[0] += x;
    this.origin[1] += y;

    this._calculateDiagonal();

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

    this._calculateDiagonal();

    if (this.children) {
      this.children.forEach((node) => { node.moveTo(x, y) });
    }

    if (this.shadow) {
      this.shadow.forEach((node) => { node.moveTo(x, y) });
    }
  }

  update(width, height) {
    this.width = width;
    this.height = height;

    this._calculateDiagonal();
  }

  _calculateDiagonal() {
    this.diagonal = [
      this.origin[0] + this.width,
      this.origin[1] + this.height
    ];
  }

  intersects(point) {
    return this.intersectsY(point) && this.intersectsX(point);
  }

  intersectsY(point) {
    return point[1] >= this.origin[1] && point[1] <= this.diagonal[1];
  }

  intersectsX(point) {
    return point[0] >= this.origin[0] && point[0] <= this.diagonal[0];
  }

  render(ctx) {
    if (this.visible) {
      beginPath(ctx);
      setFillStyle(ctx, this.style.background);
      setStrokeStyle(ctx, this.style.border);
      fillRect(ctx, this.origin, this.width, this.height);
      strokeRect(ctx, this.origin, this.width, this.height);
    }

    if (this.children) this.children.forEach((element) => element.render(ctx));
    if (this.shadow) this.shadow.forEach((element) => element.render(ctx));
  }
}