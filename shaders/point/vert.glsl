uniform mat3 screen;

attribute vec2 pos;
attribute float rad;
attribute vec2 circle_in;
attribute vec3 color_in;
attribute float alpha_in;

varying vec3 circle;
varying vec4 color;
varying float radius;

uniform float aspect;

uniform float pix_w;

uniform float max_rad;

void main () {
     circle = vec3 (circle_in, 1.0);
     color = vec4 (color_in, alpha_in);
     radius = rad / max_rad;
     vec3 p = screen * vec3 (pos, 1.0);

     //float stroke_width = 2.0;

     //p += (rad + stroke_width) * vec3 (circle_in.x * pix_w, circle_in.y * pix_w * aspect, 0);
     p += rad * vec3 (circle_in.x * pix_w, circle_in.y * pix_w * aspect, 0);
     gl_Position = vec4 (p, 1.0);
}
