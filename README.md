# Documentation on Using Tile Data from MET

This repository documents how we use tile server data from MET to visualize temperature and wind data using WebGL shaders. The docs are deployed at [https://nrkno.github.io/yr-map-docs/](https://nrkno.github.io/yr-map-docs/). 

These examples does not go in depth on how to set up WebGl in the client, wich is why the repository is public so those that are interested can see how we have done it. 

Note that this is done using WebGl 1, and with no helper library for the WebGl part. If we sould rewrite our map code on Yr now, we would have used WebGl 2, and probably a helper library aswell to make things a bit more readable.

**You are welcome to clone this repo locally if you want, just follow the guide at the bottom of this page.**

## Cloning and running the repository

You are welcome to clone this repository and play around with the shader code. We have used Astro as a framework to generate the static sites we deploy, but you should not have to touch any of the Astro components unless you want to.

1. Clone the repository:

`git clone https://github.com/nrkno/yr-map-docs.git`

2. Install dependencies

`npm install`

3. Run dev server

`npm run dev`

## Run production/build

`npm run build`

`npm run preview`


## Changing the code

We recommend just using `npm run dev` so you have hot module reloading and can see the changes you make on the fly.

## Make your own color gradient

The gradients used for the temperature and wind heatmap is defined in [colors.ts](./src/helpers/colors.ts). In the same file you also see the function that is creating the CanvasElement and adding the gradient to it. We choose to render the CanvasElement on the screen, but that is not necessary.

You could start by changing some of the color values in either the wind or temperature definitions and see the changes in the map.

## Making changing to the shaders

### Wind
Since this site is made using astro, the component for setting up the WebGl Context, creating the program and applying the shaders is found in [RenderWindExample](./src/components/RenderWindExample/RenderWindExample.astro). Note that this only contains a `<script>` tag, just with typescript support. Mentioning this to avoid any confusion; all WebGl Context, programs, shaders etc is loaded in plain javascript. If you run `npm run build` you can see the javascript bundle for it. 

#### Shaders
In the [shaders folder](./src/components/RenderWindExample/shaders/) we have three shaders; one vertex shader to set up the vertices where we draw the pixels in, and two fragment shaders; one for the example where we render the raw data together with the background map, and one where we apply our own gradient. 

The output of the fragment shader is `gl_FragColor`, so if you change this value you can see the result on screen. 

### Temperature

Since this site is made using astro, the component for setting up the WebGl Context, creating the program and applying the shaders is found in [RenderTemperatureExample](./src/components/RenderTemperatureExample/RenderTemperatureExample.astro). Note that this only contains a `<script>` tag, just with typescript support. Mentioning this to avoid any confusion; all WebGl Context, programs, shaders etc is loaded in plain javascript. If you run `npm run build` you can see the javascript bundle for it. 

### Shaders
In the [shaders folder](./src/components/RenderTemperatureExample/shaders/) we have three shaders; one vertex shader to set up the vertices where we draw the pixels in, and two fragment shaders; one for the example where we render the raw data together with the background map, and one where we apply our own gradient. 

The output of the fragment shader is `gl_FragColor`, so if you change this value you can see the result on screen. 


## WebGL Resources

We recommend [WebGlFundamentals](https://webglfundamentals.org/), or [WebGl2Fundamentals](https://webgl2fundamentals.org/) (for WebGl2) as good starting points for learning WebGl.

One of the contributers on WebGlFundamentals also made a tiny helper library called [TWGL](https://twgljs.org/). 

In the creators own words: 
> This library's sole purpose is to make using the WebGL API less verbose.

## Creating one big image based on multiple tiles

In addition to the boilerplate scripts we get from using Astro as a framework, we have added a script called `generate-static-tile`. This will use the [options](./scripts/options.ts) to generate one static tile covering the defined bounds, using the specified zoom-level. 

Based on the bounds we will find all the tiles needed, download these and save them temporarily in `scripts/temp` - and at the end we will stitch these tiles together to make one big picture that we use as our textures in WebGl. 

If you are to use this in an actual map context, you will need to take into account that the bounds of all the tiles might be larger than the bounds of what the map is showing - usually by multiplying with a matrix that is provided by the map library you choose to use. 

### Changing the bounds and generating your own tiles

We will **not provide** a tile server for the background map. Since these are generated as static resources on demand, and can potentially cause a lot of stress on our servers. `WIND_SOURCE` and
`TEMPERATURE_SOURCE` is provided by MET - these are the endpoints that contains the tile with the actual weather data, and are free to use as you please.

So if you want to play around with this part of the code you need to either set up your own raster tile server, or find one that is open and free. Please note that many of the free services does not allow downloading tiles in a bundle. ince we are using  plain multiplying colors as a way of blending in the shaders, our background is mainly white except for borders and coastlines. If you use raster tiles with more color in them the result will look different. Then you could look up other ways to blend colors to get the result you want. 

The output paths are defined in [options](./scripts/options.ts) aswell - and is currently set to the `public` folder that is used by Astro.
