uniform mat3 screen;

attribute vec3 pos;
attribute vec3 tex_in;

varying vec2 tex;

void main () {
     tex = tex_in.xy;
     vec3 p = screen * pos;
     gl_Position = vec4 (p.xy, 0.0, p.z);
}