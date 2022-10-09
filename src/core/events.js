import { roundRect } from './canvas.js';

export const showDetails = (ctx, entries, coordinates, up = true) => {
  
};

export const getHandler = (target) => {
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
        if (lastActive.onMouseLeave) lastActive.onMouseLeave(target.ctx);
        if (node.onMouseEnter) node.onMouseEnter(target.ctx);
        lastActive = node;
      }

      flag = false;
    });

    flag = true;
  };
};
