import Rectangle from '../elements/rectangle.js';
import { TreeNode } from '../utils/tree.js';
import { fillText, setFillStyle, beginPath, fillRect, strokeRect, setStrokeStyle, fill } from './canvas.js';

const getLegendStandardSizes = (settings) => {
  const unit = {
    marker: {
      width: 2.25 * settings.font.size,
    },
    text: {
      margin: {
        left: 0.5 * settings.font.size
      }
    },
    margin: {
      right: 1 * settings.font.size,
      bottom: 0.5 * settings.font.size
    },

    height: 0.65 * settings.font.size
  };

  const margin = {
    top: 0.5 * settings.font.size,
    right: 2 * settings.font.size,
    left: 2 * settings.font.size
  };

  const width = settings.width - margin.right - margin.left;

  const height = settings.height * 0.35 - margin.top;


  return {
    unit,
    margin,
    width,
    height
  }
}

export const getLegend = (ctx, settings) => {
  const data = settings.dataset.data;
  const standard = getLegendStandardSizes(settings);
  const legend = new Rectangle(
    [standard.margin.left, standard.margin.top],
    standard.width,
    standard.height,
    { role: 'legend' }
  );

  let i = 0;
  let x = standard.margin.left;
  let y = standard.margin.top;
  let carryUnit = null;

  while (y < standard.height && i < data.length) {
    const row = new Rectangle(
      [x, y],
      standard.width,
      standard.unit.height,
      { role: 'legendRow' }
    );

    if (carryUnit) {
      carryUnit.translate(-(carryUnit.origin[0] - x), y - carryUnit.origin[1]);
      row.addChild(carryUnit);
      x += carryUnit.width + standard.unit.margin.right;
      carryUnit = null;
    }

    while (i < data.length) {
      const label = data[i].label;
      const textMeasurements = ctx.measureText(label);

      const marker = new Rectangle(
        [x, y],
        standard.unit.marker.width,
        standard.unit.height,
        { role: 'legendMarker' }
      );

      const text = new Rectangle(
        [x + marker.width + standard.unit.text.margin.left, y],
        label.width,
        standard.unit.height,
        {
          role: 'legendLabel',
          content: label
        }
      );

      const unit = new Rectangle(
        [x, y],
        marker.width + textMeasurements.width + standard.unit.text.margin.left,
        standard.unit.height,
        { role: 'legendUnit' }
      )

      unit.addChild(marker);
      unit.addChild(text);
      row.addChild(unit);

      x += unit.width + standard.unit.margin.right;
      i++;

      if (x > standard.margin.left + standard.width) {
        carryUnit = unit;
        x -= unit.width + standard.unit.margin.right;
        break;
      }
    }

    row.width = x - standard.unit.margin.right - standard.margin.left;
    row.translate((legend.width - row.width) / 2, 0)
    console.log(x)
    legend.addChild(row);
    x = standard.margin.left;
    y += row.height + standard.unit.margin.bottom;
  }

  strokeRect(ctx, legend.origin, legend.width, legend.height);
  legend.children.forEach((row) => {
    strokeRect(ctx, row.origin, row.width, row.height);

    if (!row.children) return;

    row.children.forEach((unit) => {
      // strokeRect(ctx, unit.origin, unit.width, unit.height);

      const marker = unit.children.head;
      const text = unit.children.tail;
      fillRect(ctx, marker.origin, marker.width, marker.height);
      fillText(ctx, text.meta.content, [text.origin[0], text.origin[1] + text.height]);
    });
  })
};