attribute vec2 aPosition;
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
}