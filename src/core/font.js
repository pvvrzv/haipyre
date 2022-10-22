export const DEFAULT_FONT = {
  style: 'normal',
  variant: 'normal',
  weight: 'normal',
  size: 12,
  family: ['Helvetica', 'Arial', 'sans-serif'],
  get string() {
    return `${this.style} ${this.variant} ${this.weight} ${this.size}px/1 ${this.family}`;
  },
};

export const normalize = (userFont) => {
  return Object.assign(DEFAULT_FONT, userFont);
};
