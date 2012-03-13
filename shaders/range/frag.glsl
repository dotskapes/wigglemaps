#ifdef GL_ES
precision highp float;
#endif

varying vec4 color;

void main () {
  gl_FragColor = color;
}