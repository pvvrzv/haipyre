import { Pie, Lines, Radar, Polar } from './src/index.js';

const canvas = document.getElementById('canvas');

const data = [
  { label: 'Jan.', value: -5, style: { background: '#35688E', border: '' } },
  { label: 'Feb.', value: 20, style: { background: '#A2596D', border: '' } },
  { label: 'March', value: 10, style: { background: '#5C4A72', border: '' } },
  { label: 'Apr.', value: -5, style: { background: '#F2B05B', border: '' } },
  { label: 'May.', value: 8, style: { background: '#F4874C', border: '' } },
  { label: 'June', value: 3, style: { background: '#F56A4E', border: '' } },
];

const radarData = [
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
const radarLabels = ['running', 'cycling', 'sleeping', 'walking', 'juggle'];

const dataset = {
  data: data,
};
const radaDataset = {
  radarLabels: radarLabels,
  data: radarData,
};

const parameters = {
  legend: {
    marker: 'disk',
  },
  style: {
    background: '#E7EBEE',
  },
};

const chart = new Radar(canvas, radaDataset, parameters);
