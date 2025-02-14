precision mediump float;

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
}