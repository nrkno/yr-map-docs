precision mediump float;

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
}