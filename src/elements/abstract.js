import { TreeNode } from "../utils/tree.js";

export default class Abstract extends TreeNode {
  constructor(parameters, meta = {}, colorScheme = {}) {
    super(meta);

    this.parameters = parameters;
    this.colorScheme = colorScheme;
  }
}