attribute vec2 pos;
attribute vec2 tex_in;

varying vec2 tex;

void main () {
     tex = tex_in;
     gl_Position = vec4 (pos, 0.0, 1.0);
}
