#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D sampler;

varying vec2 tex;

void main () {
  vec4 color = texture2D (sampler, tex);
  gl_FragColor = color;
}