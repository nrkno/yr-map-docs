import { Program } from '../../helpers/webgl/program';
import { Texture } from '../../helpers/webgl/Texture';
import { Buffer } from '../../helpers/webgl/buffer';

export class BlendImagesProgram extends Program {
  private dataTexture: Texture;
  private mapTexture: Texture;
  private colorGradientTexture?: Texture;
  private vertexBuffer: Buffer;
  private textureCoordinateBuffer: Buffer;
  constructor({
    gl,
    dataImage,
    mapImage,
    colorGradientCanvas,
    fragmentShaderSource,
    vertexShaderSource,
    initialIndex,
  }: {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    dataImage: HTMLImageElement;
    mapImage: HTMLImageElement;
    colorGradientCanvas?: HTMLCanvasElement;
    fragmentShaderSource: string;
    vertexShaderSource: string;
    initialIndex: number;
  }) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.dataTexture = new Texture({
      gl,
      source: dataImage,
      textureIndex: initialIndex + 1,
      flipY: true,
    });

    this.mapTexture = new Texture({
      gl,
      source: mapImage,
      textureIndex: initialIndex + 2,
      flipY: true,
    });

    if (colorGradientCanvas != null) {
      this.colorGradientTexture = new Texture({
        gl,
        source: colorGradientCanvas,
        textureIndex: initialIndex + 3,
        flipY: true,
        premultiplyAlpha: true,
      });
    }

    this.vertexBuffer = new Buffer({
      gl,
      data: new Float32Array(setRectangle(0, 0, this.dataTexture.size.width, this.dataTexture.size.height)),
    });

    this.textureCoordinateBuffer = new Buffer({
      gl,
      data: new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
    });

    gl.useProgram(this.program);
    gl.uniform2f(this.getUniform('uResolution'), gl.canvas.width, gl.canvas.height);
    gl.uniform1i(this.getUniform('uDataTexture'), this.dataTexture.index);
    gl.uniform1i(this.getUniform('uMapTexture'), this.mapTexture.index);
    if (this.colorGradientTexture != null) {
      gl.uniform1i(this.getUniform('uColorGradientTexture'), this.colorGradientTexture.index);
    }
    gl.useProgram(null);
  }

  draw(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    gl.useProgram(this.program);

    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);

    this.dataTexture.bind();
    this.mapTexture.bind();
    this.colorGradientTexture?.bind();

    this.vertexBuffer.bind();
    gl.vertexAttribPointer(this.getAttribute('aPosition'), 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.getAttribute('aPosition'));

    // Texture coordinates
    this.textureCoordinateBuffer.bind();
    gl.vertexAttribPointer(this.getAttribute('aTexCoords'), 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.getAttribute('aTexCoords'));

    // Clear the canvas
    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

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
