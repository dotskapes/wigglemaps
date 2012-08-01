#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D sampler0;
uniform sampler2D sampler1;
uniform sampler2D sampler2;
uniform sampler2D sampler3;
uniform sampler2D sampler4;
uniform sampler2D sampler5;

varying vec2 tex;
varying float lookup_raw;

uniform float desaturate;
uniform float darken;
uniform float hue;
uniform vec4 hue_color;

void main () {
  //int lookup = int (floor (tex.x * 6.0));
  int lookup = int (floor (lookup_raw * 6.0));
  //float t = tex.x - (float (lookup) / 6.0);
  //float u = t * 6.0;
  //vec2 v = clamp (vec2 (u, 1.0 - tex.y), 0.0, 1.0);
  vec2 v = clamp (vec2 (tex.x, 1.0 - tex.y), 0.0, 1.0);
  vec4 color;
  //gl_FragColor = vec4 (v, 0.0, 1.0);
  //return;
  if (lookup == 0)
      color = texture2D (sampler0, v);
  else if (lookup == 1)
      color = texture2D (sampler1, v);
  else if (lookup == 2)
      color = texture2D (sampler2, v);
  else if (lookup == 3)
      color = texture2D (sampler3, v);
  else if (lookup == 4)
      color = texture2D (sampler4, v);
  else if (lookup == 5)
      color = texture2D (sampler5, v);
  else
      color = vec4 (0.0, 0.0, 0.0, 1.0);

  float avg = (color.r * .3 + color.g * .59 + color.b * .11);
  vec4 avg_color = vec4 (avg, avg, avg, color.a);
  color = avg_color * desaturate + color * (1.0 - desaturate);
  vec3 c = color.rgb * darken;
  c = c * (1.0 - hue) + hue_color.rgb * hue;
  gl_FragColor = vec4 (c, color.a);
}