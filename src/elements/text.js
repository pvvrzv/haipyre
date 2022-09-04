import Rectangle from "./rectangle.js";
import { fillText, setFillStyle } from "../core/canvas.js";

export default class Text extends Rectangle {
  constructor(parameters, meta = {}, style = {}) {
    super(parameters, meta, style);

    this.content = parameters.content;
  }

  render(ctx) {
    setFillStyle(ctx, this.style.color);
    fillText(ctx, this.content, this.origin);
  }
}