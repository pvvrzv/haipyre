import { fillText, setFillStyle, beginPath, fillRect, strokeRect, setStrokeStyle } from './canvas.js';
import { getLegend } from './helpers.js';

export const displayLegend = (settings) => {
  const legend = getLegend(settings);
  const data = settings.dataset.data;
  const measurements = [];

  let x = 0;
  let y = legend.linePadding;
  let i = 0;
  let j = 0;
  let w = 0;


  settings.ctx.textBaseline = 'middle';
  beginPath(settings.ctx);

  while (y + legend.unit.height + legend.linePadding < legend.maxHeight && i < data.length) {
    w = settings.ctx.measureText(data[i].label).width;
    x += w + legend.unit.withoutText;

    if (x > legend.width) {
      drawLegendRow(x - (w + legend.unit.withoutText + legend.unit.margin), y, i, measurements, legend, settings);

      x = w + legend.unit.withoutText;
      y += legend.linePadding + legend.unit.height;
      j = 0;

      measurements.length = 0;
    };

    measurements[j] = w;
    i++;
    j++;
  }

  if (measurements.length !== 0 && y < legend.maxHeight) {
    drawLegendRow(x - legend.unit.margin, y, i, measurements, legend, settings);
    y += legend.linePadding + legend.unit.height;
  }

  legend.height = y;

  return legend;
};

const drawLegendRow = (width, y, endIndex, measurements, legend, settings) => {
  const data = settings.dataset.data;
  const padding = (settings.width - width) / 2;
  const startIndex = endIndex - measurements.length;

  for (let i = startIndex, j = 0, x = padding; i < endIndex; i++, j++) {
    beginPath(settings.ctx);

    setFillStyle(settings.ctx, data[i].background || settings.colorScheme.data.background);
    setStrokeStyle(settings.ctx, data[i].border || data[i].background || settings.colorScheme.data.background);
    fillRect(settings.ctx, [x, y], legend.unit.rect, legend.unit.height);
    strokeRect(settings.ctx, [x, y], legend.unit.rect, legend.unit.height);
    x += legend.unit.rect + legend.unit.space;

    setFillStyle(settings.ctx, '#000000');
    fillText(settings.ctx, data[i].label, [x, y + legend.unit.halfHeight]);

    x += measurements[j] + legend.unit.margin;
  }
};