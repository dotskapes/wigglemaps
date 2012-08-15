#ifdef GL_ES
precision highp float;
#endif

#define KERNEL 3
#define STD .7
#define PI 3.14159265

uniform sampler2D sampler;

uniform float width;
uniform float height;

uniform float cols;
uniform float rows;

uniform int blur;

varying vec2 tex;

float round (in float p) {
    float r = floor (p);
    if (abs (r - p) < .5)
        return r;
    else
        return (r + 1.0);
}

vec2 round (in vec2 p) {
    return vec2 (round (p.x), round (p.y));
}

void main () {
  if (blur == 0) {
    vec2 norm = tex * vec2 (cols, rows);
    vec2 nearest = round (norm);
    vec2 x = nearest - norm;
    vec2 coord = (nearest) / vec2 (cols, rows);
    
    vec4 color = texture2D (sampler, coord);
    gl_FragColor = color;
  }
  else {
    float px = 1.0 / float (width);
    float py = 1.0 / float (height);

    vec2 norm = tex * vec2 (cols, rows);
    vec2 nearest = round (norm);
    vec2 x = nearest - norm;
    vec4 v = vec4 (0.0, 0.0, 0.0, 0.0);
    float total = 0.0;
    float rad = 2.0 * STD * STD;
        for (int i = -KERNEL; i <= KERNEL; i ++) {
        for (int j = -KERNEL; j <= KERNEL; j ++) {
	     vec2 coord = (nearest + vec2 (float (j) + .5, float (i) + .5)) / vec2 (cols, rows);
             vec4 color = texture2D (sampler, coord);
             float d = length (x + vec2 (j, i));
             float k = exp (-d / rad) / (PI * rad);
             v += color * k;
             total += k;
        }
        }
    v /= total;
    gl_FragColor = v;
    }
}
