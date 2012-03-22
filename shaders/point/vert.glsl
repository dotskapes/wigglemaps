uniform mat3 screen;

attribute vec3 pos;
attribute vec3 circle_in;
attribute vec4 color_in;

varying vec3 circle;
varying vec4 color;

uniform float aspect;
uniform float rad;
uniform float pix_w;

void main () {
     circle = circle_in;
     color = color_in;
     vec3 p = screen * pos;
     p += vec3 (circle_in.x * rad * pix_w, circle_in.y * rad * pix_w * aspect, 0);
     gl_Position = vec4 (p.xy, 1.0, p.z);
}