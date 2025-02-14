# Documentation on Using Tile Data from MET

This repository documents how we use tile server data from MET to visualize temperature and wind data using WebGL shaders. The site is deployed at [https://nrkno.github.io/yr-map-docs/](https://nrkno.github.io/yr-map-docs/).

You are welcome to clone this repo locally if you want, just follow the guide at the bottom of this page.

## Overview

We demonstrate how to:

- Display raw data fetched from a tile server.
- Use shaders to read from the tile images and render both raw data and data using our own color gradient.

## Examples

### Wind Example

- Shows how to visualize wind data using WebGL shaders.
- Demonstrates the process of rendering raw wind data and applying a custom color gradient.

If you want to play around with the shaders for the wind example you can see them in the [shaders folder](./src/components/RenderWindExample/shaders/). The code for setting up the WebGL context is in the [RenderWindExample](./src/components/RenderWindExample/RenderWindExample.astro) component.

### Temperature Example

- Shows how to visualize temperature data using WebGL shaders.
- Demonstrates the process of rendering raw temperature data and applying a custom color gradient.

If you want to play around with the shaders for the temperature example you can see them in the [shaders folder](./src/components/RenderTemperatureExample/shaders/). The code for setting up the WebGL context is in the [RenderTemperatureExample](./src/components/RenderTemperatureExample/RenderTemperatureExample.astro) component.

## Custom NPM script

In addition to the boilerplate scripts we get from using Astro as a framework, we have added a script called `generate-static-tile`. This will use the [options](./scripts/options.ts) to generate one static tile covering the defined bounds, using the specified zoom-level.

**We will not** provide raster tiles for the background, so if you want to play around with this code using different bounds or zoom levels - you need to find or set up your own raster tile server. Please note that if you are doing that, the result will not look the same, because of the way we are multiplying the color with the background. In these heatmap examples the background layer should be as white as possible, with the exception of borders wich should be darkgrey/black.

The output paths are defined in [options](./scripts/options.ts) aswell - and is currently set to the `public` folder that is used by Astro.

## Run the docs locally

1. Clone the repository:

`git clone https://github.com/nrkno/yr-map-docs.git`

2. Install dependencies

`npm install`

3. Run dev server

`npm run dev`

## Run production/build

`npm run build`

`npm run preview`

When server is running you will see at wich port it is available on.
