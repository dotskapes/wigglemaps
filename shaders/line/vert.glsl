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
    //float one_px = sqrt (px_w * abs (norm.x) * px_w * abs (norm.x) + px_h * abs (norm.y) * px_h * abs (norm.y));
    //vec2 one_px = vec2 (norm.x * px_w, norm.y * px_h);

    //float x_px = norm.x / px_w;
    //float y_px = norm.y / px_h;
     
    float x_px = 5.0;
    float y_px = 5.0;
     
    float num_px = sqrt (pow (x_px, 2.0) + pow (y_px, 2.0));

    p += .5 * RADIUS * (vec3 (norm, 0.0) / num_px);
  */

     
  vec3 p = screen * vec3 (pos, 1.0);
  vec3 screen_norm = normalize (screen * vec3 (norm, 0.0));

  float x_px = abs (screen_norm.x / px_w);
  float y_px = abs (screen_norm.y / px_h);

  float num_px = sqrt (pow (x_px, 2.0) + pow (y_px, 2.0));

  p += (.5 * width) * screen_norm * length (norm) / num_px;
  gl_Position = vec4 (p.xy, 0.0, 1.0);
     
     
  /*vec2 world_norm = vec2 (norm.x / px_w, norm.y / px_h);
    if (abs (norm.x) > abs (norm.y))
    world_norm = norm / abs (norm.x);
    else
    world_norm = norm / abs (norm.y);
     
    vec3 p = screen * vec3 (pos + (world_norm / 100.0), 1.0);
    gl_Position = vec4 (p.xy, 0.0, 1.0);*/
     
}
