uniform mat3 screen;

attribute vec2 pos;
attribute float rad;
attribute vec2 circle_in;
attribute vec3 color_in;
attribute vec3 stroke_color_in;
attribute float alpha_in;
attribute float stroke_width_in;
attribute float fill_in;
attribute float stroke_in;

varying vec3 unit_circle;
varying vec4 fill_color_frag;
varying vec4 stroke_color_frag;
varying float fill_frag;
varying float stroke_frag;

varying float radius;
varying float stroke_width;

uniform float aspect;
uniform float pix_w;
uniform float max_rad;

void main () {
  unit_circle = vec3 (circle_in, 1.0);
  fill_color_frag = vec4 (color_in, alpha_in);
  stroke_color_frag = vec4 (stroke_color_in, alpha_in);
  stroke_width = stroke_width_in;
  fill_frag = fill_in;
  stroke_frag = stroke_in;

  radius = rad / max_rad;
  vec3 p = screen * vec3 (pos, 1.0);
  
  p += (rad + stroke_width) * vec3 (circle_in.x * pix_w, circle_in.y * pix_w * aspect, 0);
  //p += rad * vec3 (circle_in.x * pix_w, circle_in.y * pix_w * aspect, 0);
  gl_Position = vec4 (p, 1.0);
}
