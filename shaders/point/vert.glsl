uniform mat3 screen;

attribute vec2 pos;
attribute vec2 circle_in;
attribute vec3 color_in;
attribute float alpha_in;

varying vec3 circle;
varying vec4 color;

uniform float aspect;
uniform float rad;
uniform float pix_w;

void main () {
     circle = vec3 (circle_in, 1.0);
     color = vec4 (color_in, alpha_in);
     vec3 p = screen * vec3 (pos, 1.0);
     p += vec3 (circle_in.x * rad * pix_w, circle_in.y * rad * pix_w * aspect, 0);
     gl_Position = vec4 (p, 1.0);
}