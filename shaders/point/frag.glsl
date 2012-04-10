#ifdef GL_ES
precision highp float;
#endif

#define STEP .8

varying vec3 circle;
varying vec4 color;

uniform float zoom;
uniform bool select;

uniform sampler2D glyph;

void main () {
  vec2 tex = (circle.xy + 1.0) / 2.0;
  float rad = length (circle.xy);
  gl_FragColor = color;
  if (!select) {
    gl_FragColor.a *= clamp (1.0 - smoothstep (STEP, 1.0, rad), 0.0, 1.0);
  }
  else {
    if (rad > 1.0) 
      gl_FragColor.a = 0.0;
  }

}