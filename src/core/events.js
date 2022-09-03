import { moveVectorOrigin, getVectorAngle } from "../utils/utils.js";
import Arc from "../elements/arc.js";

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