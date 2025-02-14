import { createProgram, getAttributeLocations, getUniformLocations } from './gl';

export class Program {
  program: WebGLProgram;
  private attributeLocations: { [key: string]: number } = {};
  private uniformLocations: { [key: string]: WebGLUniformLocation } = {};

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    gl.useProgram(this.program);

    this.attributeLocations = getAttributeLocations(gl, this.program);
    this.uniformLocations = getUniformLocations(gl, this.program);

    gl.useProgram(null);
  }

  getAttribute(name: string) {
    if (name in this.attributeLocations === false) {
      throw new Error(`Attribute "${name}" not found`);
    }

    return this.attributeLocations[name];
  }

  getUniform(name: string) {
    if (name in this.uniformLocations === false) {
      throw new Error(`Uniform "${name}" not found`);
    }

    return this.uniformLocations[name];
  }
}
