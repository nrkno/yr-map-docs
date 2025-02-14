import{r as u,c as v,B as s}from"./BlendImagesProgram.o_etajTM.js";var c=`attribute vec2 aPosition;
attribute vec2 aTexCoords;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
   /// Get a normalized position based on the resolution and the position of the vertex
   vec2 normalizedPosition = aPosition / uResolution;

   /// In WebGL the vertex shader transforms vertices into what is called clip space
   /// The clip space goes from -1 to 1 in both x and y
   vec2 positionInClipSpace = (normalizedPosition * 2.0) -1.0;

   /// Update the varying variable vTexCoord (containing texture coordinates)
   vTexCoord = aTexCoords;

   gl_Position = vec4(positionInClipSpace, 0, 1);
}`,f=`precision mediump float;

uniform sampler2D uDataTexture; /// Texture containing the wind data
uniform sampler2D uMapTexture; /// Texture containing the background map

varying vec2 vTexCoord;

void main() {
      /// Calling texture2D to get the color of the wind data and the background map
      vec4 windDataColor = texture2D(uDataTexture, vTexCoord);
      vec4 mapTextureColor = texture2D(uMapTexture, vTexCoord);

      /// Blend the colors by multiplying them
      gl_FragColor = windDataColor * mapTextureColor;
}`,w=`precision mediump float;

uniform sampler2D uDataTexture; /// Our wind data
uniform sampler2D uMapTexture; /// Our background map
uniform sampler2D uColorGradientTexture; /// Our color gradient

uniform float uMaxSpeed;

varying vec2 vTexCoord;

/// This function takes the wind data and returns a direction vector
vec2 getDirectionFromWindData(vec4 windData) {
  return vec2(
    (windData.r * 255.0 - 128.0) / 2.0,
    (windData.g * 255.0 - 128.0) / 2.0
  );
}

void main() {
      /// Getting wind data from the wind data texture, and getting the color from the backgroundmap texture
      vec4 windDataColor = texture2D(uDataTexture, vTexCoord);
      vec4 mapTextureColor = texture2D(uMapTexture, vTexCoord);
        
      /// Calling getDirectionFromWindData to get the direction of the wind, in form of a vector
      vec2 direction = getDirectionFromWindData(windDataColor);

      /// Calculating the length of the vector, which is the speed of the wind
      float speed = sqrt((direction.x * direction.x) + (direction.y * direction.y));

      /// Normalizing the speed to be between 0 and 1, so we can use it as a lookup in our color gradient
      float normalizedSpeed = speed / uMaxSpeed;

      /// In this example the color gradient is moving from left to right, so we send the normalized speed as the x value.
      vec4 windColor = texture2D(uColorGradientTexture, vec2(normalizedSpeed, 0.0));

      /// Multiplying the wind color with the background map color
      /// This could (and probably should) be done by rendering the wind color on top of the background map,
      /// and using a blend func in WebGL
      gl_FragColor = windColor * mapTextureColor;
    }`;const m=document.getElementById("map-image");if(!(m instanceof HTMLImageElement))throw new Error("Image not found");const g=document.getElementById("wind-data-image");if(!(g instanceof HTMLImageElement))throw new Error("Image not found");function p(a,e){if(a.dataset.loaded==="true"&&e.dataset.loaded==="true"){const o=document.getElementById("wind-canvas"),t=document.getElementById("wind-example-canvas");if(!(o instanceof HTMLCanvasElement)||!(t instanceof HTMLCanvasElement))throw new Error("Canvas not found");u({canvas:o,width:e.naturalWidth,height:e.naturalHeight}),u({canvas:t,width:e.naturalWidth,height:e.naturalHeight});const x=v({type:"wind",parentElement:t}),r=o.getContext("webgl"),n=t.getContext("webgl");if(!r||!n)throw new Error("WebGL not supported");const i=o.dataset,d=t.dataset;if(i.initialIndex===void 0||typeof i.initialIndex!="string"||d.initialIndex===void 0||typeof d.initialIndex!="string")throw new Error("Initial index not found");const h=new s({gl:r,mapImage:a,dataImage:e,fragmentShaderSource:f,vertexShaderSource:c,initialIndex:parseInt(i.initialIndex)}),l=new s({gl:n,mapImage:a,dataImage:e,colorGradientCanvas:x,fragmentShaderSource:w,vertexShaderSource:c,initialIndex:parseInt(d.initialIndex)});n.useProgram(l.program),n.uniform1f(l.getUniform("uMaxSpeed"),127/2),n.useProgram(null),h.draw(r),l.draw(n);return}window.requestAnimationFrame(p.bind(null,a,e))}p(m,g);
