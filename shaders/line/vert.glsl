uniform mat3 screen;

attribute vec2 pos;
attribute vec2 norm;
attribute vec3 color_in;
attribute vec2 circle_in;
attribute float alpha_in;

uniform float px_w;
uniform float px_h;

//varying vec2 circle;
varying vec4 color;
varying float alpha;

void main () {
     //circle = circle_in;
     color = vec4 (color_in, 1.0);
     alpha = alpha_in;
     vec3 p = screen * vec3 (pos, 1.0);
     float one_px = sqrt (px_w * abs (norm.x) * px_w * abs (norm.x) + px_h * abs (norm.y) * px_h * abs (norm.y));
     p += .5 * one_px * vec3 (norm, 0.0);
     gl_Position = vec4 (p.xy, 0.0, 1.0);
}