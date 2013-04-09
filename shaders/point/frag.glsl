#ifdef GL_ES
precision highp float;
#endif

varying vec3 unit_circle;
varying vec4 fill_color_frag;
varying vec4 stroke_color_frag;

uniform float aspect;
uniform float max_rad;
varying float radius;

varying float stroke_width;

varying float fill_frag;
varying float stroke_frag;

bool to_bool (in float value) {
  if (value < 0.0)
    return false;
  else
    return true;
}

void main () {
  bool fill = to_bool (fill_frag);
  bool stroke = to_bool (stroke_frag);

  vec4 stroke_color, fill_color;

  // No stroke or fill implies nothing to draw
  if (!fill && !stroke)
    discard;

  // Get normalized texture coordinates and polar r coordinate
  vec2 tex = (unit_circle.xy + 1.0) / 2.0;
  float rad = length (unit_circle.xy);

  // If there is no stroke, the fill region should transition to nothing
  if (!stroke)
    stroke_color = vec4 (fill_color_frag.rgb, 0.0);
  else
    stroke_color = stroke_color_frag;

  // Likewise, if there is no fill, the stroke should transition to nothing
  if (!fill)
    fill_color = vec4 (stroke_color.rgb, 0.0);
  else
    fill_color = fill_color_frag;

  float radius_width = radius * max_rad;

  // Distance to antialias over
  float antialias_dist = 3.0 / (2.0 * radius * max_rad);

  if (rad < radius_width / (radius_width + stroke_width)) {
    float end_step = radius_width / (radius_width + stroke_width);
    float step = smoothstep (end_step - antialias_dist, end_step, rad);
    gl_FragColor = mix (fill_color, stroke_color, step);
  }
  else {
    float step = smoothstep (1.0 - antialias_dist, 1.0, rad);
    gl_FragColor = mix (stroke_color, vec4 (stroke_color.rgb, 0.0), step);
  }

  //float step = smoothstep (1.0 - antialias_dist, 1.0, rad);
  //gl_FragColor = mix (color, vec4 (color.rgb, 0.0), step);
}
