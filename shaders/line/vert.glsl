uniform mat3 world;
uniform mat3 screen;

attribute vec2 pos;
attribute vec2 norm;
attribute vec3 color_in;
attribute vec2 circle_in;
attribute float alpha_in;
attribute float width_in;

uniform float px_w;
uniform float px_h;

uniform float ratio;

varying vec2 circle;
varying vec4 color;
varying float alpha;

void main () {

  circle = circle_in;
  color = vec4 (color_in, 1.0);
  alpha = alpha_in;

  float width = width_in * 2.0;
  
  /*   
  vec3 p = screen * vec3 (pos, 1.0);
  //vec3 screen_norm = normalize (screen * vec3 (norm, 0.0));
  vec3 screen_norm = normalize (screen_norm);

  float x_px = abs (screen_norm.x / px_w);
  float y_px = abs (screen_norm.y / px_h);

  float num_px = sqrt (pow (x_px, 2.0) + pow (y_px, 2.0));

  p += (.5 * width) * len (norm) / num_px;
  gl_Position = vec4 (p.xy, 0.0, 1.0);
  */

  vec3 p = world * vec3 (pos, 1.0);
  vec3 screen_norm = normalize (world * vec3 (norm, 0.0));

  vec3 screen_pos = screen * (p + .5 * screen_norm * width);

  gl_Position = vec4 (screen_pos.xy, 0.0, 1.0);
     
}
