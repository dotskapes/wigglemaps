#ifdef GL_ES
precision highp float;
#endif

varying vec2 circle;
varying vec4 color;
varying float alpha;

void main () {
  gl_FragColor = vec4 (color.rgb, alpha);
  
  if (abs (circle.y) > .5)
    gl_FragColor.a = alpha - (abs (circle.y) - .5) / .5;
}
