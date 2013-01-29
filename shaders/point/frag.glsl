#ifdef GL_ES
precision highp float;
#endif

varying vec3 circle;
varying vec4 color;

uniform float aspect;
uniform float max_rad;
varying float radius;

void main () {
  vec2 tex = (circle.xy + 1.0) / 2.0;
  float rad = length (circle.xy);
  gl_FragColor = color;

  /*bool stroke = true;
  vec4 stroke_color = vec4 (1.0, 0.0, 0.0, 1.0);
  float stroke_width = 2.0;*/

  float radius_width = radius * max_rad;

  float antialias_dist = 3.0 / (2.0 * radius * max_rad);

  /*if (rad < radius_width / (radius_width + stroke_width)) {
    float end_step = radius_width / (radius_width + stroke_width);
    float step = smoothstep (end_step - antialias_dist, end_step, rad);
    gl_FragColor = mix (color, stroke_color, step);
  }
  else {
    float step = smoothstep (1.0 - antialias_dist, 1.0, rad);
    gl_FragColor = mix (stroke_color, vec4 (stroke_color.rgb, 0.0), step);
  }*/

  float step = smoothstep (1.0 - antialias_dist, 1.0, rad);
  gl_FragColor = mix (color, vec4 (color.rgb, 0.0), step);
}
