import Rectangle from '../elements/rectangle.js';
import Arc from '../elements/arc.js';
import Text from '../elements/text.js';
import { TAU } from './math.js';

const MARKER_TYPES = ['rectangle', 'square', 'disk'];

export const getLegendSettings = (settings, parameters) => {
  const font = settings.font;

  const marker = {};
  marker.type = MARKER_TYPES.includes(parameters.legend?.marker) ? parameters.legend.marker : 'rectangle';
  marker.height = font.height * 0.75;
  marker.width = marker.type === 'rectangle' ? marker.height * 2.375 : marker.height;
  marker.radius = marker.height / 2;
  marker.margin = {
    right: marker.height * 0.5,
  };

  const margin = {
    top: 0.5 * font.height,
    right: 2 * font.height,
    left: 2 * font.height,
  };

  const width = settings.width - margin.right - margin.left;

  const height = settings.height * 0.35 - margin.top;

  return {
    width,
    height,
    marker,
    margin,
  };
};

const createRowElement = (origin, standard) => {
  return new Rectangle(
    {
      origin: origin,
      width: standard.width,
      height: standard.marker.height,
      visible: false,
    },
    { role: 'legendRow' }
  );
};

const createRectangleMarker = (origin, standard, dataEntry) => {
  return new Rectangle(
    {
      origin: origin,
      width: standard.marker.width,
      height: standard.marker.height,
    },
    {
      role: 'legendMarker',
    },
    {
      background: dataEntry.style.background || settings.style.data.backgroundAlpha,
      border: dataEntry.style.border || dataEntry.style.background || settings.style.data.background,
    }
  );
};

const createDiscMarker = (origin, standard, dataEntry) => {
  return new Arc(
    {
      origin: origin.map((c) => c + standard.marker.radius),
      radius: {
        inner: 0,
        outer: standard.marker.radius,
      },
      angle: {
        start: 0,
        end: TAU,
      },
    },
    {
      role: 'legendMarker',
    },
    {
      background: dataEntry.style.background || settings.style.data.backgroundAlpha,
      border: dataEntry.style.border || dataEntry.style.background || settings.style.data.background,
    }
  );
};

const createMarkerElement = (origin, standard, dataEntry, type) => {
  return type === 'disk'
    ? createDiscMarker(origin, standard, dataEntry)
    : createRectangleMarker(origin, standard, dataEntry);
};

const createTextElement = (origin, standard, content, ctx) => {
  const measurements = ctx.measureText(content);
  return new Text(
    {
      origin: [origin[0] + standard.marker.width + standard.marker.margin.right, origin[1]],
      width: measurements.width,
      height: standard.marker.height,
      content: content,
      baseline: 'top',
    },
    {
      role: 'legendLabel',
    },
    {
      color: '#000',
    }
  );
};

const createUnitElement = (origin, standard, text) => {
  return new Rectangle(
    {
      origin: origin,
      width: standard.marker.width + standard.marker.margin.right + text.width,
      height: standard.marker.height,
      visible: false,
    },
    { role: 'legendUnit' }
  );
};

export const createLegend = (ctx, data, settings) => {
  const standard = settings.legend;
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
    const row = createRowElement([x, y], standard);

    if (carryUnit) {
      carryUnit.translate(-(carryUnit.origin[0] - x), y - carryUnit.origin[1]);
      row.addChild(carryUnit);
      x += carryUnit.width + standard.marker.margin.right;
      carryUnit = null;
    }

    while (i < data.length) {
      const dataUnit = data[i];

      const marker = createMarkerElement([x, y], standard, dataUnit, settings.legend.marker.type);

      const text = createTextElement([x, y], standard, dataUnit.label, ctx);

      const unit = createUnitElement([x, y], standard, text);

      unit.addShadow(marker);
      unit.addShadow(text);

      x += unit.width + standard.marker.margin.right;
      i++;

      if (x > standard.margin.left + standard.width) {
        carryUnit = unit;
        x -= unit.width + standard.marker.margin.right;
        break;
      }

      row.addChild(unit);
    }

    row.update(x - standard.marker.margin.right - standard.margin.left, row.height);
    row.translate((legend.width - row.width) / 2, 0);
    legend.addChild(row);
    x = standard.margin.left;
    y += row.height + settings.font.height;
  }

  legend.update(legend.width, y);

  ctx.textBaseline = 'top';

  return legend;
};
