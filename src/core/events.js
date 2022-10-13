import { beginPath, fill, fillText, rect, roundRect, setFillStyle, setTextBaseLine, moveTo, lineTo } from './canvas.js';

const DETAILS_POINTER_HEIGHT = 10;
const DETAILS_PADDING = [10, 20];
const DETAILS_MARKER = {
  width: 15,
  height: 15,
  marginLeft: 10,
};

export const getHandler = (target) => {
  let flag = false;
  let lastActive = target;

  return (e) => {
    if (flag) return;

    const point = [e.offsetX, e.offsetY];
    const node = target.findLast((node) => {
      return node.intersects(point);
    });

    requestAnimationFrame(() => {
      if (node !== lastActive) {
        if (lastActive.onMouseLeave) lastActive.onMouseLeave();
        if (node.onMouseEnter) {
          node.onMouseEnter();
        }
        lastActive = node;
      }

      flag = false;
    });

    flag = true;
  };
};

export const displayEntryDetails = (ctx, origin, entry, font, position = 'top') => {
  const text = `${entry.meta.label}: ${entry.meta.value}`;
  const textMeasurements = ctx.measureText(text);

  const rectWidth = textMeasurements.width + DETAILS_MARKER.width + DETAILS_PADDING[1] * 2 + DETAILS_MARKER.marginLeft;
  const rectHeight = DETAILS_MARKER.height + DETAILS_PADDING[0] * 2;
  const rectOrigin = [origin[0] - rectWidth / 2, origin[1] - rectHeight - DETAILS_POINTER_HEIGHT + 1];
  const markerOrigin = [rectOrigin[0] + DETAILS_PADDING[1], rectOrigin[1] + DETAILS_PADDING[0]];
  const labelOrigin = [
    markerOrigin[0] + DETAILS_MARKER.width + DETAILS_MARKER.marginLeft,
    markerOrigin[1] + DETAILS_MARKER.height / 2,
  ];

  //triangle (pointer)
  beginPath(ctx);
  moveTo(ctx, origin);
  //add +1 so it doesn't clip. Fix this!!!
  const leftCathetusCoordinates = [origin[0] + DETAILS_POINTER_HEIGHT, origin[1] - DETAILS_POINTER_HEIGHT + 1];
  const rightCathetusCoordinates = [
    leftCathetusCoordinates[0] - DETAILS_POINTER_HEIGHT * 2,
    leftCathetusCoordinates[1],
  ];
  lineTo(ctx, leftCathetusCoordinates);
  lineTo(ctx, rightCathetusCoordinates);

  //rounded rectangle (background)
  roundRect(ctx, rectOrigin, rectWidth, rectHeight, 10);
  setFillStyle(ctx, 'rgb(0,0,0,0.75)');
  fill(ctx);

  //marker
  beginPath(ctx);
  setFillStyle(ctx, entry.style.background);
  rect(ctx, markerOrigin, DETAILS_MARKER.width, DETAILS_MARKER.height);
  fill(ctx);

  //text
  beginPath(ctx);
  setTextBaseLine(ctx, 'middle');
  setFillStyle(ctx, '#fff');
  fillText(ctx, text, labelOrigin);
};
