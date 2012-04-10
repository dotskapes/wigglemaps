attribute vec2 pos;
attribute vec2 edge_in;

varying vec3 edge;

void main () {
     edge = vec3 (edge_in, 1.0);
     gl_Position = vec4 (pos, 0.0, 1.0);
}