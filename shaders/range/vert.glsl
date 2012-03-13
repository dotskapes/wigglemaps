attribute vec3 pos;
attribute vec4 color_in;

varying vec4 color;

void main () {
     color = color_in;
     gl_Position = vec4 (pos, 1.0);
}