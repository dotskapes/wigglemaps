attribute vec3 pos;
attribute vec4 color_in;

uniform float height;
uniform float width;

varying vec4 color;

void main () {
     color = color_in;
     gl_Position = vec4 (pos.x / (width / height), pos.y, pos.z, 1.0);
}