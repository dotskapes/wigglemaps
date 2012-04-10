attribute vec2 pos;
attribute vec4 color_in;

varying vec4 color;

void main () {
     color = color_in;
     gl_Position = vec4 (pos, 0.0, 1.0);
}