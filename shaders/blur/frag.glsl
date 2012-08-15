#ifdef GL_ES
precision highp float;
#endif

#define KERNEL 10
#define STD 1.0
#define PI 3.14159265

uniform sampler2D sampler;
uniform int hor;

uniform int width;
uniform int height;

varying vec2 tex;

//uniform float kernel [KERNEL + 1];

void main () {
  
  //(0.0, 0.0, 0.0, 0.0, 1.0, .5, 1.0, 0.0, 0.0, 0.0, 0.0);
  float kernel [KERNEL + 1]; 
  kernel[0] = 4.0;
  kernel[1] = 2.0;
  kernel[2] = 1.0;
  kernel[3] = 0.0;
  kernel[4] = 0.0;
  kernel[5] = 0.0;
  kernel[6] = 0.0;
  kernel[7] = 0.0;
  kernel[8] = 0.0;
  kernel[9] = 0.0;
  kernel[10] = 0.0;

  float px = 1.0 / float (width);
  float py = 1.0 / float (height);
  
  float rad = 2.0 * STD * STD;

  vec4 v = vec4 (0.0, 0.0, 0.0, 0.0);
  float total = 0.0;
  if (hor != 0) {
    for (int i = 0; i <= 0; i ++) {
      for (int j = -KERNEL; j <= KERNEL; j ++) {
	float k = kernel [int (abs (float (j)))];
	if (k > 1e-6) {
	  vec2 coord = tex + vec2 (float (j) * px, float (i) * py);
	  vec4 color = texture2D (sampler, coord);
	  color.rgb *= color.a;
	  //float d = length (vec2 (j, i));
	  //float k = exp (-d / rad) / (STD * sqrt (2.0 * PI));
	  v += color * k;
	  total += k;
	}
      }
    }
  }
  else {
    for (int i = -KERNEL; i <= KERNEL; i ++) {
      for (int j = 0; j <= 0; j ++) {
	float k = kernel [int (abs (float (i)))];
	if (k > 1e-6) {
	  vec2 coord = tex + vec2 (float (j) * px, float (i) * py);
	  vec4 color = texture2D (sampler, coord);
	  color.rgb *= color.a;
	  //float d = length (vec2 (j, i));
	  //float k = exp (-d / rad) / (STD * sqrt (2.0 * PI));
	  v += color * k;
	  total += k;
	}
      }
    }
  }
  v /= total;
  gl_FragColor = v;
  gl_FragColor.rgb /= gl_FragColor.a;
}
