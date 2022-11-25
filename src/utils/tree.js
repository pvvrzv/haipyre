import List from './list.js';
import EventEmmiter from '../events/emitter.js';

export class TreeNode extends EventEmmiter {
  constructor(meta, children = null, shadow = null) {
    super();
    this.meta = meta;
    this.parent = null;
    this.children = children;
    this.shadow = shadow;
    this.prev = null;
    this.next = null;

    if (children) children.forEach((node) => (node.parent = this));
    if (shadow) shadow.forEach((node) => (node.parent = this));
  }

  addChild(node) {
    if (!this.children) this.children = new List();
    node.parent = this;
    this.children.push(node);
  }

  addShadow(node) {
    if (!this.shadow) this.shadow = new List();
    node.parent = this;
    this.shadow.push(node);
  }

  clearChildren() {
    this.children = null;
  }

  findLast(predicate) {
    if (!this.children) return this;
    const next = this.children.find(predicate);
    if (next === undefined) return this;
    return next.findLast(predicate);
  }
}

export class Tree extends TreeNode {
  constructor(meta = {}) {
    super(meta);
  }
}
