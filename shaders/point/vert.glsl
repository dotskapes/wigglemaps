uniform mat3 screen;

attribute vec3 pos;
attribute vec3 circle_in;
attribute vec3 color_in;
attribute float alpha_in;

varying vec3 circle;
varying vec4 color;

uniform float aspect;
uniform float rad;
uniform float pix_w;

void main () {
     circle = circle_in;
     color = vec4 (color_in, alpha_in);
     vec3 p = screen * pos;
     p += vec3 (circle_in.x * rad * pix_w, circle_in.y * rad * pix_w * aspect, 0);
     gl_Position = vec4 (p.xy, 1.0, p.z);
}