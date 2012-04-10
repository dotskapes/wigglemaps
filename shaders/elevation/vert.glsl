uniform mat3 screen;

attribute vec2 pos;
attribute vec2 tex_in;

varying vec2 tex;

void main () {
     tex = tex_in;
     vec3 p = screen * vec3 (pos, 1.0);
     gl_Position = vec4 (p, 1.0);
}