import { createCanvas, getCanvasContext } from './canvas';
import { rescale } from './rescale';

export const colors = {
  wind: [
    { value: 0, color: '#A7CEA1' },
    { value: 5.5, color: '#79ccac' },
    { value: 8, color: '#3cbebe' },
    { value: 10.8, color: '#13a8d6' },
    { value: 13.9, color: '#4b87ea' },
    { value: 17.2, color: '#7b57ed' },
    { value: 20.8, color: '#7043A8' },
    { value: 24.5, color: '#5B278D' },
    { value: 28.5, color: '#4D0A6C' },
    { value: 32.6, color: '#310047' },
  ],
  temperature: [
    { value: -50, color: '#481581' },
    { value: -40, color: '#114F9D' },
    { value: -30, color: '#649BE2' },
    { value: -20, color: '#6AC6EE' },
    { value: -10, color: '#85E4ED' },
    { value: 0, color: '#D0F5D9' },
    { value: 10, color: '#FFF36E' },
    { value: 20, color: '#FFB37A' },
    { value: 30, color: '#FF5D46' },
    { value: 40, color: '#B21002' },
    { value: 50, color: '#78003D' },
  ],
};

const minMaxValues = {
  wind: {
    max: (256 - 128) / 2, // The max possible wind speed we can get from the data is 64
    min: 0,
  },
  temperature: {
    max: 128,
    min: -128,
  },
};

// Min/max values for rgb values
const COLOR_STOP = 255;
const COLOR_START = 0;

// The canvas will be rendered right next to the parentElement
export function createColorCanvas({
  type,
  parentElement,
}: {
  type: 'wind' | 'temperature';
  parentElement: HTMLElement;
}) {
  const canvas = createCanvas({ width: COLOR_STOP, height: 1 });
  const context = getCanvasContext({ canvas });
  const gradient = context.createLinearGradient(0, 0, COLOR_STOP, 0);
  const currentColors = type === 'wind' ? colors.wind : colors.temperature;
  const { max, min } = minMaxValues[type];

  currentColors.forEach(({ value, color }) => {
    const rescaledValue = rescale({ fromX: value, from: { min, max }, to: { min: COLOR_START, max: COLOR_STOP } });

    const normalizedValue = rescaledValue / COLOR_STOP;

    gradient.addColorStop(normalizedValue, color);
  });

  context.fillStyle = gradient;
  context.fillRect(0, 0, COLOR_STOP, 1);

  // If we want to show the canvas on screen, we can use this code snippet
  canvas.style.border = '1px solid black';
  canvas.style.borderRadius = 'unset';
  canvas.style.margin = '10px 0';
  canvas.style.width = '100%';
  canvas.style.height = '15px';
  canvas.style.imageRendering = 'pixelated';
  canvas.style.pointerEvents = 'none';

  const textElement = document.getElementById(`${type}-example-text`);

  textElement!.after(canvas);

  return canvas;
}
