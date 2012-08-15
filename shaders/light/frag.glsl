#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D base;
uniform sampler2D normal;

uniform float azimuth;

varying vec2 tex;

float ambient = .5;

void main () {
  vec3 light = normalize (vec3 (cos (azimuth), sin (azimuth), 1.0));

  vec3 color = texture2D (base, tex).rgb;
  vec3 norm = texture2D (normal, tex).rgb;

  norm = (norm * 2.0) - 1.0;
  float diffuse = clamp (dot (light, norm), 0.0, 1.0);
  vec3 final = clamp ((ambient + diffuse) * color, 0.0, 1.0);
  gl_FragColor = vec4 (final, 1.0);
}
