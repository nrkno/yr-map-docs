import{r as l,c as g,B as d}from"./BlendImagesProgram.o_etajTM.js";var m=`attribute vec2 aPosition;
attribute vec2 aTexCoords;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
   /// convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = aPosition / uResolution;

   /// convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   /// convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   vTexCoord = aTexCoords;
   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   /// pass the texCoord to the fragment shader
   /// The GPU will interpolate this value between points.
}`,h=`precision mediump float;

/// our texture
uniform sampler2D uDataTexture; /// Texture containing the temperature data
uniform sampler2D uMapTexture; /// Texture containing the background map

varying vec2 vTexCoord;

void main() {
      /// Calling texture2D to get the color of the temperature data and the background map
      vec4 temperatureDataColor = texture2D(uDataTexture, vTexCoord);
      vec4 mapTextureColor = texture2D(uMapTexture, vTexCoord);
      
      /// Blend the colors by multiplying them
      gl_FragColor = temperatureDataColor *  mapTextureColor;
}`,C=`precision mediump float;

/// our texture
uniform sampler2D uDataTexture;
uniform sampler2D uMapTexture;
uniform sampler2D uColorGradientTexture;

varying vec2 vTexCoord;

void main() {
    /// Getting temperature data from the temperature data texture, 
    /// and getting the color from the backgroundmap texture
    vec4 temperatureData = texture2D(uDataTexture, vTexCoord);
    vec4 mapTextureColor = texture2D(uMapTexture, vTexCoord);
    
    /// In this example the color gradient is moving from left to right, where the color on the
    /// far left represents the coldest value and far right the warmest, so we can use the 
    /// r-value directly since it represents the temperature
    vec4 temperatureColor = texture2D(uColorGradientTexture, vec2(temperatureData.r, 0.0));

    gl_FragColor = temperatureColor * mapTextureColor;
}`;const s=document.getElementById("map-image");if(!(s instanceof HTMLImageElement))throw new Error("Image not found");const c=document.getElementById("temperature-data-image");if(!(c instanceof HTMLImageElement))throw new Error("Image not found");function p(r,e){if(r.dataset.loaded==="true"&&e.dataset.loaded==="true"){const n=document.getElementById("temperature-canvas"),t=document.getElementById("temperature-example-canvas");if(!(n instanceof HTMLCanvasElement)||!(t instanceof HTMLCanvasElement))throw new Error("Canvas not found");l({canvas:n,width:e.naturalWidth,height:e.naturalHeight}),l({canvas:t,width:e.naturalWidth,height:e.naturalHeight});const x=g({type:"temperature",parentElement:t}),a=n.getContext("webgl"),o=t.getContext("webgl");if(!a||!o)throw new Error("WebGL not supported");const i=n.dataset,u=t.dataset;if(i.initialIndex===void 0||typeof i.initialIndex!="string"||u.initialIndex===void 0||typeof u.initialIndex!="string")throw new Error("Initial index not found");const v=new d({gl:a,mapImage:r,dataImage:e,fragmentShaderSource:h,vertexShaderSource:m,initialIndex:parseInt(i.initialIndex)}),f=new d({gl:o,mapImage:r,dataImage:e,colorGradientCanvas:x,fragmentShaderSource:C,vertexShaderSource:m,initialIndex:parseInt(u.initialIndex)});v.draw(a),f.draw(o);return}window.requestAnimationFrame(p.bind(null,r,e))}p(s,c);
