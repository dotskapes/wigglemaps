#ifdef GL_ES
precision highp float;
#endif

varying vec2 tex;
varying float mode;

uniform float px;
uniform float py;

float f (in vec2 pos) {
  return pos.x * pos.x - pos.y;
}

void main () {
  vec4 color = vec4 (1.0, 1.0, 1.0, 1.0);
  if (mode > .25 && mode < .75) {
    gl_FragColor = color;
  }
  else {
    float iso = f (tex);

    //vec2 dx = vec2 (2.0 * tex.x, -1.0);
    //vec2 tex2 = tex + dx * vec2 (px, py);
    //float next = f (tex2);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
	vec2 t = tex + vec2 (float (j) * px, float (i) * py);
	if (sign (iso) != sign (f (t))) {
	  gl_FragColor = vec4 (1.0, 1.0, 1.0, 0.5);
	  return;
	}
      }
    }
      
    if (mode > .75)
      iso *= -1.0;

    if (iso <= 0.0)
      gl_FragColor = color;
    else
      gl_FragColor = vec4 (0.0, 0.0, 0.0, 0.0);
  }
}
