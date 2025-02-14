precision mediump float;

uniform sampler2D uDataTexture; /// Texture containing the wind data
uniform sampler2D uMapTexture; /// Texture containing the background map

varying vec2 vTexCoord;

void main() {
      /// Calling texture2D to get the color of the wind data and the background map
      vec4 windDataColor = texture2D(uDataTexture, vTexCoord);
      vec4 mapTextureColor = texture2D(uMapTexture, vTexCoord);

      /// Blend the colors by multiplying them
      gl_FragColor = windDataColor * mapTextureColor;
}