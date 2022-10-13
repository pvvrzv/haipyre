export const DEFAULT_FONT = {
  style: 'normal',
  variant: 'normal',
  weight: 'normal',
  size: 12,
  family: ['Helvetica', 'Arial', 'sans-serif'],
};

export const normalize = (userFont) => {
  const font = Object.assign(DEFAULT_FONT, userFont);
  font.string = `${font.style} ${font.variant} ${font.weight} ${font.size}px/1 ${font.family}`;
  return font;
};
