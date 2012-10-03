#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265
#define SHADE_RES 1.0 / 2048.0
#define ALPHA 1.0

uniform sampler2D elevation;
//uniform sampler2D background;

varying vec2 tex;
varying vec2 tex2;

uniform float pix_w;
uniform float pix_h;

uniform float altitude;
uniform float azimuth;

//varying vec3 world_p;
//vec3 light = vec3 (0.0, 90.0, 25.0);

void main () {
  /*float zenith_rad = (90.0 - altitude) * PI / 180.0;
  float azimuth_math = (360.0 - (azimuth * 360.0) + 90.0);
  if (azimuth_math >= 360.0)
     	azimuth_math -= 360.0; 
  float azimuth_rad = azimuth_math * PI / 180.0;
  
  float z_factor = 1.0;*/
  
  float azimuth_rad = azimuth * 2.0 * PI;
  float altitude_rad = -altitude * 2.0 * PI;
  
  float a = 5555.0 * texture2D (elevation, tex + vec2 (-SHADE_RES, SHADE_RES)).r;
  float b = 5555.0 * texture2D (elevation, tex + vec2 (0.0, SHADE_RES)).r;
  float c = 5555.0 * texture2D (elevation, tex + vec2 (SHADE_RES, SHADE_RES)).r;
  float d = 5555.0 * texture2D (elevation, tex + vec2 (-SHADE_RES, 0.0)).r;
  float e = 5555.0 * texture2D (elevation, tex + vec2 (0.0, 0.0)).r;
  float f = 5555.0 * texture2D (elevation, tex + vec2 (SHADE_RES, 0.0)).r;
  float g = 5555.0 * texture2D (elevation, tex + vec2 (-SHADE_RES, -SHADE_RES)).r;
  float h = 5555.0 * texture2D (elevation, tex + vec2 (0.0, -SHADE_RES)).r;
  float i = 5555.0 * texture2D (elevation, tex + vec2 (SHADE_RES, -SHADE_RES)).r;
  
  float dx = ((c + 2.0 * f + i) - (a + 2.0 * d + g)) / (8.0);
  float dy = ((g + 2.0 * h + i) - (a + 2.0 * b + c)) / (8.0);
  
  /*float slope_rad = atan (z_factor * sqrt (dx * dx + dy * dy));
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
  gl_FragColor = vec4 (h_color, hillshade * ALPHA);*/

  vec3 x = vec3 (SHADE_RES, 0.0, dx);
  vec3 y = vec3 (0.0, SHADE_RES, dy);
  vec3 norm = normalize (cross (x, y));

  vec3 light = vec3 (cos (azimuth_rad), sin (azimuth_rad), altitude_rad);
  //vec3 norm = normalize (vec3 (-dx, -dy, 1.0));
  vec3 shade = vec3 (0.0, 0.0, 0.0);
  float opacity = dot (light, norm);

  gl_FragColor = vec4 (shade, opacity * ALPHA);

  /*float a = texture2D (elevation, tex + vec2 (-SHADE_RES, SHADE_RES)).r;
  float b = texture2D (elevation, tex + vec2 (0.0, SHADE_RES)).r;
  float c = texture2D (elevation, tex + vec2 (SHADE_RES, SHADE_RES)).r;
  float d = texture2D (elevation, tex + vec2 (-SHADE_RES, 0.0)).r;
  float e = texture2D (elevation, tex + vec2 (0.0, 0.0)).r;
  float f = texture2D (elevation, tex + vec2 (SHADE_RES, 0.0)).r;
  float g = texture2D (elevation, tex + vec2 (-SHADE_RES, -SHADE_RES)).r;
  float h = texture2D (elevation, tex + vec2 (0.0, -SHADE_RES)).r;
  float i = texture2D (elevation, tex + vec2 (SHADE_RES, -SHADE_RES)).r;

  vec3 x = vec3 (1.0, 0.0, -d * 5000.0) - vec3 (-1.0, 0.0, -f * 5000.0);
  vec3 y = vec3 (0.0, 1.0, -b * 5000.0) - vec3 (0.0, -1.0, -h * 5000.0);

  vec3 z = cross (x, y);
  z = normalize (z);
  
  vec3 light = normalize (vec3 (cos (azimuth), sin (azimuth), 1.0));
  float shade = dot (z, light);

  shade = (1.0 - shade);

  gl_FragColor = vec4 ((z + 1.0) / 2.0, 1.0);*/
  
}
