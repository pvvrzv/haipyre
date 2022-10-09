import Rectangle from '../elements/rectangle.js';
import Text from '../elements/text.js';

const getLegendStandardSizes = (settings) => {
  const unit = {
    marker: {
      width: 2.25 * settings.font.size,
    },
    text: {
      margin: {
        left: 0.5 * settings.font.size,
      },
    },
    margin: {
      right: 1 * settings.font.size,
      bottom: 0.5 * settings.font.size,
    },

    height: 0.65 * settings.font.size,
  };

  const margin = {
    top: 0.5 * settings.font.size,
    right: 2 * settings.font.size,
    left: 2 * settings.font.size,
  };

  const width = settings.width - margin.right - margin.left;

  const height = settings.height * 0.35 - margin.top;

  return {
    unit,
    margin,
    width,
    height,
  };
};

export const getLegend = (ctx, settings) => {
  const data = settings.dataset.data;
  const standard = getLegendStandardSizes(settings);
  const legend = new Rectangle(
    {
      origin: [standard.margin.left, standard.margin.top],
      width: standard.width,
      height: standard.height,
      visible: false,
    },
    { role: 'legend' }
  );

  let i = 0;
  let x = standard.margin.left;
  let y = standard.margin.top;
  let carryUnit = null;

  while (y < standard.height && i < data.length) {
    const row = new Rectangle(
      {
        origin: [x, y],
        width: standard.width,
        height: standard.unit.height,
        visible: false,
      },
      { role: 'legendRow' }
    );

    if (carryUnit) {
      carryUnit.translate(-(carryUnit.origin[0] - x), y - carryUnit.origin[1]);
      row.addChild(carryUnit);
      x += carryUnit.width + standard.unit.margin.right;
      carryUnit = null;
    }

    while (i < data.length) {
      const dataUnit = data[i];
      const textMeasurements = ctx.measureText(dataUnit.label);

      const marker = new Rectangle(
        {
          origin: [x, y],
          width: standard.unit.marker.width,
          height: standard.unit.height,
        },
        { role: 'legendMarker' },
        {
          background:
            dataUnit.background || settings.colorScheme.data.backgroundAlpha,
          border:
            dataUnit.border ||
            dataUnit.background ||
            settings.colorScheme.data.background,
        }
      );

      const text = new Text(
        {
          origin: [x + marker.width + standard.unit.text.margin.left, y],
          width: textMeasurements.width,
          height: standard.unit.height,
          content: dataUnit.label,
        },
        {
          role: 'legendLabel',
        },
        {
          color: '#000',
        }
      );

      const unit = new Rectangle(
        {
          origin: [x, y],
          width: marker.width + standard.unit.text.margin.left + text.width,
          height: standard.unit.height,
          visible: false,
        },
        { role: 'legendUnit' }
      );

      unit.addShadow(marker);
      unit.addShadow(text);

      x += unit.width + standard.unit.margin.right;
      i++;

      if (x > standard.margin.left + standard.width) {
        carryUnit = unit;
        x -= unit.width + standard.unit.margin.right;
        break;
      }

      row.addChild(unit);
    }

    row.update(
      x - standard.unit.margin.right - standard.margin.left,
      row.height
    );
    row.translate((legend.width - row.width) / 2, 0);
    legend.addChild(row);
    x = standard.margin.left;
    y += row.height + standard.unit.margin.bottom;
  }

  legend.update(legend.width, y);

  ctx.textBaseline = 'top';

  return legend;
};
