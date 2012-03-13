attribute vec3 pos;
attribute vec3 edge_in;

varying vec3 edge;

void main () {
     edge = edge_in;
     gl_Position = vec4 (pos.xy, 0.0, pos.z);
}