export interface ISize {
  width: number;
  height: number;
}

export function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) {
  const program = gl.createProgram();
  if (program == null) {
    throw new Error('Could not create program');
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
  }

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  gl.validateProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw `Could not compile WebGL program. \n\n${info}`;
  }

  return program;
}

function createShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw new Error('Could not create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  return shader;
}

export function createTexture({
  gl,
  size,
  flipY = false,
  premultiplyAlpha = false,
  wrapS = 'CLAMP_TO_EDGE',
  wrapT = 'CLAMP_TO_EDGE',
  filter = 'NEAREST',
}: {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  size?: { width: number; height: number };
  flipY?: boolean;
  premultiplyAlpha?: boolean;
  wrapS?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
  wrapT?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
  filter?: 'NEAREST' | 'LINEAR';
}) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);

  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error('Could not create texture');
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapS]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapT]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filter]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter]);

  if (size != null) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size.width, size.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }

  return texture;
}

export function resizeTexture({
  gl,
  texture,
  size,
}: {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  texture: WebGLTexture;
  size: { width: number; height: number };
}) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size.width, size.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
}

export function createTextureFromSource({
  gl,
  source,
  flipY = false,
  premultiplyAlpha = false,
  wrapS = 'CLAMP_TO_EDGE',
  wrapT = 'CLAMP_TO_EDGE',
  filter = 'NEAREST',
}: {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  source: TexImageSource;
  flipY?: boolean;
  premultiplyAlpha?: boolean;
  wrapS?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
  wrapT?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT';
  filter?: 'NEAREST' | 'LINEAR';
}) {
  const texture = createTexture({ gl, flipY, premultiplyAlpha, wrapS, wrapT, filter });

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

  return texture;
}

export function updateTextureFromSource({
  gl,
  texture,
  source,
  flipY = false,
  premultiplyAlpha = false,
}: {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  texture: WebGLTexture;
  source: TexImageSource;
  flipY?: boolean;
  premultiplyAlpha?: boolean;
}) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}

export function updateTextureFromArrayBuffer({
  gl,
  texture,
  size,
  data,
  flipY = false,
  premultiplyAlpha = false,
}: {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  texture: WebGLTexture;
  size: { width: number; height: number };
  data: ArrayBufferView;
  flipY?: boolean;
  premultiplyAlpha?: boolean;
}) {
  const { width, height } = size;

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
}

export function getAttributeLocations(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram) {
  const attributeLocations: { [key: string]: number } = {};

  const activeAttributesCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  for (let i = 0; i < activeAttributesCount; i++) {
    const info = gl.getActiveAttrib(program, i);
    if (info == null) {
      continue;
    }

    const index = gl.getAttribLocation(program, info.name);
    attributeLocations[info.name] = index;
  }

  return attributeLocations;
}

export function getUniformLocations(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram) {
  const uniformLocations: { [key: string]: WebGLUniformLocation } = {};

  const activeUniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let i = 0; i < activeUniformsCount; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info == null) {
      continue;
    }

    const index = gl.getUniformLocation(program, info.name);
    if (index == null) {
      continue;
    }

    uniformLocations[info.name] = index;
  }

  return uniformLocations;
}

export function createBuffer(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  const buffer = gl.createBuffer();
  if (buffer == null) {
    throw new Error('Unable to create buffer');
  }

  return buffer;
}

export function createFramebuffer(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  const framebuffer = gl.createFramebuffer();
  if (framebuffer == null) {
    throw new Error('Could not create framebuffer');
  }

  return framebuffer;
}

export function createCenteredClipSpaceVertices({
  width,
  height,
  offsetX = 0,
  offsetY = 0,
  viewport,
}: {
  width: number;
  height: number;
  offsetX?: number;
  /** offsetY considers positive Y as down and negative Y as up */
  offsetY?: number;
  viewport: ISize;
}) {
  const widthInClipSpace = (width / viewport.width) * 2;
  const heightInClipSpace = (height / viewport.height) * 2;

  const offsetXInClipSpace = (offsetX / viewport.width) * 2;
  const offsetYInClipSpace = -(offsetY / viewport.height) * 2;

  const topLeft = { x: -widthInClipSpace / 2 + offsetXInClipSpace, y: heightInClipSpace / 2 + offsetYInClipSpace };
  const topRight = { x: widthInClipSpace / 2 + offsetXInClipSpace, y: heightInClipSpace / 2 + offsetYInClipSpace };
  const bottomRight = { x: widthInClipSpace / 2 + offsetXInClipSpace, y: -heightInClipSpace / 2 + offsetYInClipSpace };
  const bottomLeft = { x: -widthInClipSpace / 2 + offsetXInClipSpace, y: -heightInClipSpace / 2 + offsetYInClipSpace };

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
  };
}

export function reset(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  gl.useProgram(null);

  gl.enable(gl.BLEND);
  gl.blendEquation(gl.FUNC_ADD);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendEquation(gl.FUNC_ADD);
}

export function isWebGL2(gl: WebGLRenderingContext | WebGL2RenderingContext): gl is WebGL2RenderingContext {
  return gl.getParameter(gl.VERSION)?.startsWith('WebGL 2.0');
}
