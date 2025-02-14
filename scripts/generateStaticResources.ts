import { pointToTile } from '@mapbox/tilebelt';
import { downloadImage } from './downloadImage';
import { getOptions, IOptions } from './options';
import { createImagesFromTiles } from './createImagesFromTiles';

// Tells us the filePath of a tile and where it should be placed on the canvas
interface IImageWithXYPosition {
  backgroundFilePath: string;
  windFilePath: string;
  temperatureFilePath: string;
  x: number;
  y: number;
}

export type IImagesWithXYPosition = IImageWithXYPosition[];

async function createMergedTileFromBounds(params: IOptions) {
  const { bounds, zoomLevel, tileSize, backgroundTiles, windTiles, temperatureTiles } = params;
  const { west, south, east, north } = bounds;

  const southWestTile = pointToTile(west, south, zoomLevel);
  const northEastTile = pointToTile(east, north, zoomLevel);

  const southWestTileX = southWestTile[0];
  const southWestTileY = southWestTile[1];

  const northEastTileX = northEastTile[0];
  const northEastTileY = northEastTile[1];

  const tiles: { x: number; y: number; z: number }[] = [];
  for (let i = southWestTileX; i <= northEastTileX; i++) {
    for (let j = northEastTileY; j <= southWestTileY; j++) {
      tiles.push({ x: i, y: j, z: zoomLevel });
    }
  }

  let imagesWithPosition: IImagesWithXYPosition = [];

  const totalVerticalTiles = Math.abs(northEastTileY - southWestTileY) + 1;
  const totalHorizontalTiles = Math.abs(northEastTileX - southWestTileX) + 1;

  const imagePromises = tiles
    .map((tile) => {
      const { x, y, z } = tile;
      const positionX = tileSize * (x - tiles[0].x);
      const positionY = tileSize * (y - tiles[0].y);

      const background = {
        tileSource: backgroundTiles.urlTemplate
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y)),
        filePath: backgroundTiles.tempFilePathTemplate
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y)),
        x: positionX,
        y: positionY,
      };
      const wind = {
        tileSource: windTiles.urlTemplate.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y)),
        filePath: windTiles.tempFilePathTemplate
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y)),
        x: positionX,
        y: positionY,
      };
      const temperature = {
        tileSource: temperatureTiles.urlTemplate
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y)),
        filePath: temperatureTiles.tempFilePathTemplate
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y)),
      };

      const imagesWithXYPosition = {
        backgroundFilePath: background.filePath,
        windFilePath: wind.filePath,
        temperatureFilePath: temperature.filePath,
        x: positionX,
        y: positionY,
      };

      imagesWithPosition.push({ ...imagesWithXYPosition });
      return [
        downloadImage(background.tileSource, background.filePath),
        downloadImage(wind.tileSource, wind.filePath),
        downloadImage(temperature.tileSource, temperature.filePath),
      ];
    })
    .flat();

  await Promise.all(imagePromises);

  const dimensions = { width: tileSize * totalHorizontalTiles, height: tileSize * totalVerticalTiles };
  console.log('dimensions', dimensions);
  createImagesFromTiles({
    dimensions,
    imagesWithPosition,
    fileNames: {
      background: backgroundTiles.fileName,
      wind: windTiles.fileName,
      temperature: temperatureTiles.fileName,
    },
  });
}

async function generateStaticResources() {
  const options = await getOptions();

  createMergedTileFromBounds(options);
}

generateStaticResources();
