import { Program } from '../../helpers/webgl/program';
import type { Texture } from '../../helpers/webgl/Texture';
import { Buffer } from '../../helpers/webgl/buffer';
import fragmentShaderSource from './shaders/DrawImage.frag.glsl';
import vertexShaderSource from './shaders/DrawImage.vert.glsl';

export class DrawImageProgram extends Program {
  private texture: Texture;
  private vertexBuffer: Buffer;
  private textureCoordinateBuffer: Buffer;
  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, texture: Texture) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.texture = texture;
    this.vertexBuffer = new Buffer({
      gl,
      data: new Float32Array(setRectangle(0, 0, texture.size.width, texture.size.height)),
    });

    this.textureCoordinateBuffer = new Buffer({
      gl,
      data: new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
    });

    gl.useProgram(this.program);
    gl.uniform2f(this.getUniform('uResolution'), gl.canvas.width, gl.canvas.height);
    gl.useProgram(null);
  }

  draw(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    gl.useProgram(this.program);

    this.texture.bind();

    this.vertexBuffer.bind();
    gl.vertexAttribPointer(this.getAttribute('aPosition'), 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.getAttribute('aPosition'));

    // Texture coordinates
    this.textureCoordinateBuffer.bind();
    gl.vertexAttribPointer(this.getAttribute('aTexCoords'), 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.getAttribute('aTexCoords'));

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(null);
  }
}

function setRectangle(x: number, y: number, width: number, height: number) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  return new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);
}
