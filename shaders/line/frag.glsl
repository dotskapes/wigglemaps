#ifdef GL_ES
precision highp float;
#endif

//varying vec2 circle;
varying vec4 color;

void main () {
  gl_FragColor = color;
  //if (abs (circle.y) > .8)
  //  gl_FragColor.a = 1.0 - (abs (circle.y) - .8) / .2;
}