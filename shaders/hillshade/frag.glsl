#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265
#define SHADE_RES 1.0 / 1024.0
#define ALPHA 1.0

uniform sampler2D elevation;
//uniform sampler2D background;

varying vec2 tex;
varying vec2 tex2;

uniform float pix_w;
uniform float pix_h;

float altitude = -45.0;
uniform float azimuth;

//varying vec3 world_p;
//vec3 light = vec3 (0.0, 90.0, 25.0);

void main () {
     float zenith_rad = (90.0 - altitude) * PI / 180.0;
     float azimuth_math = (360.0 - azimuth + 90.0);
     if (azimuth_math >= 360.0)
     	azimuth_math -= 360.0; 
     float azimuth_rad = azimuth_math * PI / 180.0;
     
     float z_factor = 1.0;
     
     float a = texture2D (elevation, tex + vec2 (-SHADE_RES, SHADE_RES)).r;
     float b = texture2D (elevation, tex + vec2 (0.0, SHADE_RES)).r;
     float c = texture2D (elevation, tex + vec2 (SHADE_RES, SHADE_RES)).r;
     float d = texture2D (elevation, tex + vec2 (-SHADE_RES, 0.0)).r;
     float e = texture2D (elevation, tex + vec2 (0.0, 0.0)).r;
     float f = texture2D (elevation, tex + vec2 (SHADE_RES, 0.0)).r;
     float g = texture2D (elevation, tex + vec2 (-SHADE_RES, -SHADE_RES)).r;
     float h = texture2D (elevation, tex + vec2 (0.0, -SHADE_RES)).r;
     float i = texture2D (elevation, tex + vec2 (SHADE_RES, -SHADE_RES)).r;

     float dx = ((c + 2.0 * f + i) - (a + 2.0 * d + g)) / (8.0 * SHADE_RES);
     float dy = ((g + 2.0 * h + i) - (a + 2.0 * b + c)) / (8.0 * SHADE_RES);
     
     float slope_rad = atan (z_factor * sqrt (dx * dx + dy * dy));
     float aspect_rad = 0.0;
     if (dx != 0.0) {
       aspect_rad = atan (dy, -dx);
       if (aspect_rad < 0.0) 
       	  aspect_rad += 2.0 * PI;
     }
     if (dx == 0.0) {
     	  if (dy > 0.0)
	     aspect_rad = PI / 2.0;
	  else if (dy < 0.0)
	     aspect_rad = 2.0 * PI - PI / 2.0;
	  else {
	     slope_rad = 0.0;
             aspect_rad = 0.0;
	  }
     }     

      float hillshade = cos (zenith_rad) * cos (slope_rad) + sin (zenith_rad) * sin (slope_rad) * cos (azimuth_rad - aspect_rad);

     vec3 h_color = vec3 (0.1, 0.0, 0.0);
     gl_FragColor = vec4 (h_color, hillshade * ALPHA);
}