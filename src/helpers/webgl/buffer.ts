import { createBuffer } from './gl';

export class Buffer {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  buffer: WebGLBuffer;
  private data?: Float32Array;
  private hasNewData = false;

  constructor({ gl, data }: { gl: WebGLRenderingContext | WebGL2RenderingContext; data?: Float32Array }) {
    this.gl = gl;
    this.data = data;
    this.hasNewData = data != null;

    this.buffer = createBuffer(gl);
  }

  setData(data: Float32Array) {
    this.data = data;
    this.hasNewData = true;
  }

  // Look for a better solution to concatinate two Float32Array's
  addData(data: Float32Array) {
    this.data = this.data != null ? new Float32Array([...this.data, ...data]) : data;
  }

  getLength() {
    if (this.data == null) {
      throw new Error('No buffer data');
    }
    return this.data.length;
  }

  bind() {
    if (this.data == null) {
      throw new Error('No buffer data');
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    if (this.hasNewData === true) {
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
    }
  }
}
