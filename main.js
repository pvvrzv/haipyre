import { Pie, Lines, Radar, Polar } from './src/index.js';

const canvas = document.getElementById('canvas');

const data = [
  { label: 'Jan.', val: -5, background: 'rgb(255, 99, 132)' },
  { label: 'Feb.', val: 11, background: 'rgb(255, 99, 132)' },
  { label: 'March', val: 15, },
  { label: 'Apr.', val: -5 },
  { label: 'May.', val: 8 },
  { label: 'June', val: 3 },
  { label: 'July', val: 6 },
  { label: 'Aug.', val: 13 },
  { label: 'Sep.', val: 32 },
  { label: 'Oct.', val: 5 },
  { label: 'Nov.', val: 5 },
  { label: 'Dec.', val: 40 },
];

const radarData = [
  { label: 'Jan.', val: [-12, 1, 5, 6, 2], background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132)' },
  { label: 'Feb.', val: [0, 10, 15, 2, 1] },
  { label: 'Feb.', val: [3, 5, 2, 14], background: 'rgba(54, 162, 235, 0.2)', border: 'rgb(54, 162, 235)' },
];
const radarLabels = ['running', 'cycling', 'sleeping', 'walking', 'juggle'];

const options = {
  dataset: {
    radarLabels: radarLabels,
    data: data
  }
};

const chart = new Pie(canvas, options)