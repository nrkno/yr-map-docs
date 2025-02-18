import path from 'path';
const __dirname = path.resolve();

// const BOUNDS = { north: 53, west: 0, south: 72.7, east: 35.5 };
const BOUNDS = { north: 65.7, west: 0, south: 57.95, east: 18 };
const ZOOM_LEVEL = 5;
const TILE_SIZE = 256;

// We are not providing a real URL here, so if you want to play around with this code you need to find
// or build a raster tile server that can provide the tiles for the background.
const BACKGROUND_URL_TEMPLATE = 'some-raster-tile-server/tiles/{z}/{x}/{y}.png';
const WIND_SOURCE = 'https://beta.yr-maps.met.no/api/wind/';
const TEMPERATURE_SOURCE = 'https://beta.yr-maps.met.no/api/air-temperature/';

export interface IOptions {
  bounds: { north: number; west: number; south: number; east: number };
  zoomLevel: number;
  tileSize: number;
  backgroundTiles: {
    tempFilePathTemplate: string;
    urlTemplate: string;
    fileName: string;
  };
  windTiles: {
    tempFilePathTemplate: string;
    urlTemplate: string;
    fileName: string;
  };
  temperatureTiles: {
    tempFilePathTemplate: string;
    urlTemplate: string;
    fileName: string;
  };
}

export async function getOptions(): Promise<IOptions> {
  const windData = await fetchTileData(WIND_SOURCE);
  const temperatureData = await fetchTileData(TEMPERATURE_SOURCE);

  const windUrlTemplate = windData.times[0].tiles.png;
  const temperatureUrlTemplate = temperatureData.times[0].tiles.png;

  return {
    bounds: BOUNDS,
    zoomLevel: ZOOM_LEVEL,
    tileSize: TILE_SIZE,
    backgroundTiles: {
      tempFilePathTemplate: __dirname + '/scripts/temp/backgroundTiles/{z}-{x}-{y}.png',
      urlTemplate: BACKGROUND_URL_TEMPLATE,
      fileName: __dirname + '/public/background.png',
    },
    windTiles: {
      tempFilePathTemplate: __dirname + '/scripts/temp/windTiles/{z}-{x}-{y}.png',
      urlTemplate: windUrlTemplate,
      fileName: __dirname + '/public/wind.png',
    },
    temperatureTiles: {
      tempFilePathTemplate: __dirname + '/scripts/temp/temperatureTiles/{z}-{x}-{y}.png',
      urlTemplate: temperatureUrlTemplate,
      fileName: __dirname + '/public/temperature.png',
    },
  };
}

// Function for calling the Met sources wich has an available.json file where we can find the base url for the images
async function fetchTileData(url: string): Promise<IApiTileData> {
  const response = await fetch(url);
  const data = (await response.json()) as IApiTileData;

  return data;
}

export interface IApiTileData {
  bounds: [number, number, number, number];
  minZoom: number;
  maxZoom: number;
  scheme: 'xyz';
  times: Array<{
    time: string;
    tiles: {
      jpeg: string;
      png: string;
      webp: string;
    };
  }>;
}
