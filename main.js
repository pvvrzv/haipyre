import { Pie, Lines, Radar, Polar, Bars } from './src/index.js';

const canvas = document.getElementById('canvas');

const data = [
  { label: 'Jan.', value: -5, style: { background: '#F24452' } },
  { label: 'Feb.', value: 20, style: { background: '#04ADBF' } },
  { label: 'March', value: 10, style: { background: '#0D6973' } },
  { label: 'Apr.', value: -5, style: { background: '#F2B05B' } },
  { label: 'May.', value: 1, style: { background: '#F4874C' } },
  { label: 'June', value: 0, style: { background: '#F95D3E' } },
];

const markers = ['mon.', 'tue.', 'wed.', 'thu.', 'fri.', 'sut.', 'sun.'];
const multiLevelData = [
  {
    label: 'Jan.',
    value: [-12, 1, 5, 6, 2],
    style: { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132)' },
  },
  {
    label: 'Feb.',
    value: [3, 5, 2, 14],
    style: {
      background: 'rgba(54, 162, 235, 0.2)',
      border: 'rgb(54, 162, 235)',
    },
  },
];

const dataset = {
  data: data,
  onMouseEnter: () => {
    canvas.style.cursor = 'pointer';
  },
  onMouseLeave: () => {
    canvas.style.cursor = 'initial';
  },
};

const multiLevelDataset = {
  markers: markers,
  data: multiLevelData,
};

const parameters = {
  legend: {
    marker: 'disk',
  },
  style: {
    background: '#F5F5F5',
  },
};

const chart = new Lines(canvas, dataset, parameters);
