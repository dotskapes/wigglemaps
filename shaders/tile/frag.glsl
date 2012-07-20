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

  gl_FragColor = color;
}