export function createCanvas({ width, height, pixelRatio }: { width: number; height: number; pixelRatio?: number }) {
  const canvas = document.createElement('canvas');
  resizeCanvas({ canvas, width, height, pixelRatio });

  return canvas;
}

export function resizeCanvas({
  canvas,
  width,
  height,
  pixelRatio,
}: {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  pixelRatio?: number;
}) {
  // Scale the canvas by the given pixel ratio.
  // See https://www.html5rocks.com/en/tutorials/canvas/hidpi/
  const scale = pixelRatio ?? 1;

  canvas.width = width * scale;
  canvas.height = height * scale;
}

export function getCanvasContext({
  canvas,
  pixelRatio,
  willReadFrequently,
}: {
  canvas: HTMLCanvasElement;
  pixelRatio?: number;
  willReadFrequently?: boolean;
}) {
  const context = canvas.getContext('2d', { willReadFrequently });
  if (context == null) {
    throw new Error('Unable to get context');
  }

  context.restore();
  context.save();

  if (pixelRatio != null) {
    // Scale all drawing operations by the device pixel ratio
    // so we don't have to worry about the difference.
    // See https://www.html5rocks.com/en/tutorials/canvas/hidpi/
    context.scale(pixelRatio, pixelRatio);
  }

  return context;
}
