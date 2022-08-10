import { ListNode, List } from './list.js';

export class TreeNode extends ListNode {
  constructor(children = null) {
    super();
    this.parent = null;
    this.children = children;
  }

  addChild(node) {
    if (!this.children) {
      this.children = new List();
    }
    node.parent = this;
    this.children.push(node);
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

}

export class Tree {
  constructor() {
    this.root = new TreeNode();
  }
}