# Documentation on Using Tile Data from MET

This repository documents how we use tile server data from MET to visualize temperature and wind data using WebGL shaders. The docs are deployed at [https://nrkno.github.io/yr-map-docs/](https://nrkno.github.io/yr-map-docs/).

These examples do not go in-depth on how to set up WebGL in the client, which is why the repository is public—so those who are interested can see how we have done it.

Note that this is done using WebGL 1, without a helper library for the WebGL part. If we were to rewrite our map code on Yr now, we would use WebGL 2 and probably a helper library as well to make things more readable.

**You are welcome to clone this repo locally if you want—just follow the guide at the bottom of this page.**

## Cloning and Running the Repository

You are welcome to clone this repository and experiment with the shader code. We have used Astro as a framework to generate the static sites we deploy, but you should not need to modify any Astro components unless you want to.

1. Clone the repository:

   ```sh
   git clone https://github.com/nrkno/yr-map-docs.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the development server:

   ```sh
   npm run dev
   ```

## Running Production/Build

```sh
npm run build
npm run preview
```

## Modifying the Code

We recommend using `npm run dev` to enable hot module reloading, allowing you to see changes on the fly.

## Customizing the Color Gradient

The gradients used for the temperature and wind heatmaps are defined in [colors.ts](./src/helpers/colors.ts). In the same file, you can also find the function that creates the `CanvasElement` and applies the gradient to it. We choose to render the `CanvasElement` on the screen, but that is not necessary.

You can start by modifying some of the color values in either the wind or temperature definitions to see the changes in the map.

## Modifying the Shaders

### Wind

Since this site is built using Astro, the component for setting up the WebGL context, creating the program, and applying the shaders is found in [RenderWindExample](./src/components/RenderWindExample/RenderWindExample.astro). This file contains only a `<script>` tag with TypeScript support.

To clarify: all WebGL context, programs, shaders, etc., are loaded in plain JavaScript. If you run `npm run build`, you can see the JavaScript bundle for it.

#### Shaders

In the [shaders folder](./src/components/RenderWindExample/shaders/), we have three shaders:

- A vertex shader to define the vertices where pixels are drawn.
- Two fragment shaders:
  - One renders the raw data along with the background map.
  - One applies our custom gradient.

The output of the fragment shader is `gl_FragColor`. If you modify this value, you will see the result on screen.

### Temperature

Like the wind example, the component for setting up the WebGL context, creating the program, and applying the shaders is found in [RenderTemperatureExample](./src/components/RenderTemperatureExample/RenderTemperatureExample.astro). Again, this file only contains a `<script>` tag with TypeScript support, and all WebGL-related logic is handled in plain JavaScript.

#### Shaders

In the [shaders folder](./src/components/RenderTemperatureExample/shaders/), we have three shaders:

- A vertex shader to set up the vertices where pixels are drawn.
- Two fragment shaders:
  - One renders the raw data along with the background map.
  - One applies our custom gradient.

As with the wind example, modifying `gl_FragColor` will change the output visible on screen.

## WebGL Resources

We recommend [WebGL Fundamentals](https://webglfundamentals.org/) and [WebGL2 Fundamentals](https://webgl2fundamentals.org/) (for WebGL 2) as good starting points for learning WebGL.

One of the contributors to WebGL Fundamentals also created a small helper library called [TWGL](https://twgljs.org/).

In the creator's own words:

> This library's sole purpose is to make using the WebGL API less verbose.

## Generating a Single Image from Multiple Tiles

In addition to the boilerplate scripts provided by Astro, we have added a script called `generate-static-tile`. This script uses the [options](./scripts/options.ts) to generate a single static tile covering the defined bounds using the specified zoom level.

The script:

- Identifies the required tiles based on the given bounds.
- Downloads them and temporarily stores them in `scripts/temp`.
- Stitches them together into a single large image, which we use as textures in WebGL.

If you want to use this in an actual map context, be aware that the bounds of all the tiles might be larger than the map's visible area. This is usually handled by multiplying with a transformation matrix provided by your chosen map library.

### Modifying Bounds and Generating Custom Tiles

We **do not provide** a tile server for the background map. Since these tiles are generated as static resources on demand, serving them could put excessive strain on our servers.

`WIND_SOURCE` and `TEMPERATURE_SOURCE` are provided by MET—these endpoints contain the weather data tiles and are free to use.

If you want to experiment with this part of the code, you will need to set up your own raster tile server or find an open and free one. Be aware that many free services do not allow bulk tile downloads.

Since we use simple color multiplication for blending in the shaders, our background is mainly white except for borders and coastlines. If you use raster tiles with more colors, the result will look different. You may need to explore alternative blending methods to achieve your desired result.

The output paths are defined in [options.ts](./scripts/options.ts) and are currently set to the `public` folder used by Astro.
