import { TreeNode } from '../utils/tree.js';
import { AbstractMethodCallError } from '../core/errors.js';

export default class Element extends TreeNode {
  constructor(parameters, meta, style) {
    super(meta);

    this.origin = parameters.origin;
    this.visible = parameters.visible === undefined ? true : parameters.visible;
    this.style = style;
  }

  translate(x = 0, y = 0) {
    this._translate(x, y);
    if (this.children) this.children.forEach((element) => element.translate(x, y));
    if (this.shadow) this.shadow.forEach((element) => element.translate(x, y));
  }

  render(ctx) {
    if (this.visible) this._render(ctx);
    if (this.children) this.children.forEach((element) => element.render(ctx));
    if (this.shadow) this.shadow.forEach((element) => element.render(ctx));
  }

  clear() {
    throw new Error('Method clear was not implemented on this element');
  }

  scale(factor) {
    this._scale(factor);
    if (this.children) this.children.forEach((element) => element.scale(factor));
    if (this.shadow) this.shadow.forEach((element) => element.scale(factor));
  }

  moveTo(x = 0, y = 0) {
    this._moveTo(x, y);
    if (this.children) this.children.forEach((element) => element.moveTo(x, y));
    if (this.shadow) this.shadow.forEach((element) => element.moveTo(x, y));
  }

  intersects() {
    throw new AbstractMethodCallError();
  }

  _render() {
    throw new AbstractMethodCallError();
  }

  _translate() {
    throw new AbstractMethodCallError();
  }

  _scale() {
    throw new AbstractMethodCallError();
  }
}
