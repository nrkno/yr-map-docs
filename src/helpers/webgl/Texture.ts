import { createTexture, createTextureFromSource, resizeTexture, updateTextureFromSource, type ISize } from './gl';

type Options =
  | {
      gl: WebGLRenderingContext | WebGL2RenderingContext;
      textureIndex: number;
      size: ISize;
      flipY?: boolean;
      premultiplyAlpha?: boolean;
      wrapS?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
      wrapT?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
      filter?: 'NEAREST' | 'LINEAR';
    }
  | {
      gl: WebGLRenderingContext | WebGL2RenderingContext;
      textureIndex: number;
      source: HTMLImageElement | HTMLCanvasElement;
      flipY?: boolean;
      premultiplyAlpha?: boolean;
      wrapS?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
      wrapT?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
      filter?: 'NEAREST' | 'LINEAR';
    };

export class Texture {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  size: ISize;
  index: number;
  unit: number;
  texture: WebGLTexture;

  constructor(options: Options) {
    const { gl, textureIndex, flipY, premultiplyAlpha, wrapS, wrapT, filter } = options;

    this.gl = gl;
    this.size = 'size' in options ? options.size : { width: options.source.width, height: options.source.height };
    this.index = textureIndex;
    this.unit = gl.TEXTURE0 + textureIndex;

    if ('size' in options) {
      const { size } = options;
      this.texture = createTexture({ gl, size, flipY, premultiplyAlpha, wrapS, wrapT, filter });
    } else {
      const { source } = options;
      this.texture = createTextureFromSource({ gl: this.gl, source, flipY, premultiplyAlpha, wrapS, wrapT, filter });
    }
  }

  setSize(size: ISize) {
    if (this.size.width === size.width && this.size.height === size.height) {
      return;
    }

    this.size = size;
    resizeTexture({ gl: this.gl, texture: this.texture, size });
  }

  bind() {
    this.gl.activeTexture(this.unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  unbind() {
    this.gl.activeTexture(this.unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  updateFromSource({
    source,
    flipY = false,
    premultiplyAlpha = false,
  }: {
    source: TexImageSource;
    flipY?: boolean;
    premultiplyAlpha?: boolean;
  }) {
    this.size = { width: source.width, height: source.height };

    updateTextureFromSource({ gl: this.gl, texture: this.texture, source, flipY, premultiplyAlpha });
  }
}
