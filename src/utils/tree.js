import { ListNode, List } from './list.js';

export class TreeNode extends ListNode {
  constructor(children = null, shadow = null) {
    super();
    this.parent = null;
    this.children = children;
    this.shadow = shadow;
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

  getLastChild() {
    return this.children.pop();
  }

  getFirstChild() {
    return this.children.unshift();
  }

  clearChildren() {
    this.children = null;
  }

  hasChildren() {
    if (this.children) {
      return true;
    }
    return false;
  }

  findLast(predicate) {
    if (!this.children) return this;
    const next = this.children.find(predicate);
    if (next === undefined) return this;
    return next.findLast(predicate);
  }
}

export class Tree extends TreeNode {
  constructor() {
    super();
  }
}