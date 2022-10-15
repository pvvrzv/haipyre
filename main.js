import { Pie, Lines, Radar, Polar } from './src/index.js';

const canvas = document.getElementById('canvas');

const data = [
  { label: 'Jan.', value: -5, background: 'rgb(255, 99, 132)' },
  { label: 'Feb.', value: 11, background: 'rgb(255, 99, 132)' },
  { label: 'March', value: 15 },
  { label: 'Apr.', value: -5 },
  { label: 'May.', value: 8 },
  { label: 'June', value: 3 },
  { label: 'July', value: 6 },
  { label: 'Aug.', value: 13 },
  { label: 'Sep.', value: 32 },
  { label: 'Oct.', value: 5 },
  { label: 'Nov.', value: 5 },
  { label: 'Dec.', value: 40 },
];

const radarData = [
  { label: 'Jan.', value: [-12, 1, 5, 6, 2], background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132)' },
  { label: 'Feb.', value: [0, 10, 15, 2, 1] },
  { label: 'Feb.', value: [3, 5, 2, 14], background: 'rgba(54, 162, 235, 0.2)', border: 'rgb(54, 162, 235)' },
];
const radarLabels = ['running', 'cycling', 'sleeping', 'walking', 'juggle'];

const options = {
  dataset: {
    radarLabels: radarLabels,
    data: radarData,
  },
};

const chart = new Radar(canvas, options);
