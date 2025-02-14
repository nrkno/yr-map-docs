precision mediump float;

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
    }