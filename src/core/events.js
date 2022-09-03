import { moveVectorOrigin, getVectorAngle } from "../utils/utils.js";
import Arc from "../elements/arc.js";
import { beginPath, renderCircleSegment, renderCircle, fill, setFillStyle } from "./canvas.js";

export function onMouseEnter(ctx) {
  beginPath(ctx);
  setFillStyle(ctx, this.colorScheme.background);
  renderCircleSegment(ctx, this.origin, this.radius.outer + 5, this.radius.outer + 10, this.startAngle, this.endAngle);
  fill(ctx);
};

export function onMouseLeave(ctx) {
  // beginPath(ctx);
  // setFillStyle(ctx, '#ffffff');
  // renderCircleSegment(ctx, this.origin, this.radius.outer + 4, this.radius.outer + 11, this.startAngle, this.endAngle);
  // fill(ctx);
};

export const getEventListener = (target) => {
  let flag = false;
  let lastActive = target.om;

  return (e) => {
    if (flag) return;

    const point = [e.offsetX, e.offsetY];
    const node = target.om.findLast((node) => {
      return node.intersects(point);
    });

    requestAnimationFrame(() => {
      if (node !== lastActive) {
        console.log(node.meta.role)
        if (lastActive.onMouseLeave) lastActive.onMouseLeave(target.ctx);
        if (node.onMouseEnter) node.onMouseEnter(target.ctx);
        lastActive = node;
      }

      flag = false;
    });

    flag = true;
  }
};