import { createCanvas, loadImage } from 'canvas';
import fsPromises from 'fs/promises';
import { IImagesWithXYPosition } from './generateStaticResources';

// This function creates a one image for each layer(background, wind, temperature) from all the tiles we have downloaded
export async function createImagesFromTiles({
  dimensions,
  imagesWithPosition,
  fileNames,
}: {
  dimensions: { width: number; height: number };
  imagesWithPosition: IImagesWithXYPosition;
  fileNames: {
    background: string;
    wind: string;
    temperature: string;
  };
}) {
  // Create one canvas for each type of tiles
  const backgroundCanvas = createCanvas(dimensions.width, dimensions.height);
  const backgroundContext = backgroundCanvas.getContext('2d');

  const windCanvas = createCanvas(dimensions.width, dimensions.height);
  const windContext = windCanvas.getContext('2d');

  const temperatureCanvas = createCanvas(dimensions.width, dimensions.height);
  const temperatureContext = temperatureCanvas.getContext('2d');

  // Drawing background image
  let drawImagePromises = imagesWithPosition
    .map(async ({ backgroundFilePath, windFilePath, temperatureFilePath, x, y }) => {
      const backgrundImage = await loadImage(backgroundFilePath);
      backgroundContext.drawImage(backgrundImage, x, y);

      const windImage = await loadImage(windFilePath);
      windContext.drawImage(windImage, x, y);

      const temperatureImage = await loadImage(temperatureFilePath);
      temperatureContext.drawImage(temperatureImage, x, y);
    })
    .flat();

  await Promise.all(drawImagePromises);

  const backgroundBuffer = backgroundCanvas.toBuffer('image/png');
  await fsPromises.writeFile(fileNames.background, backgroundBuffer);

  const windBuffer = windCanvas.toBuffer('image/png');
  await fsPromises.writeFile(fileNames.wind, windBuffer);

  const temperatureBuffer = temperatureCanvas.toBuffer('image/png');
  await fsPromises.writeFile(fileNames.temperature, temperatureBuffer);
}
