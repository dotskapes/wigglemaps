uniform mat3 screen;

attribute vec3 pos;
attribute vec4 color_in;

varying vec4 color;

void main () {
     color = color_in;
     vec3 p = screen * pos;
     gl_Position = vec4 (p.xy, 0.0, p.z);
}