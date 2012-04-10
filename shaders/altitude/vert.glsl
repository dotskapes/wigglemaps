uniform mat3 screen;

attribute vec2 pos;
attribute vec2 tex_in;

varying vec2 tex;
varying vec2 tex2;

varying vec3 world_p;

void main () {
     tex = tex_in;
     //tex2 = (pos + vec2 (180.0, 90.0)) / vec2 (360.0, 180.0);
     //tex2 = tex_in;
     tex2.x = (pos.x + 180.0) / 180.0;
     tex2.y = 1.0 - (pos.y + 90.0) / 180.0;
     world_p = vec3 (pos, 0.0);
     vec3 p = screen * vec3 (pos, 1.0);
     gl_Position = vec4 (p, 1.0);
}