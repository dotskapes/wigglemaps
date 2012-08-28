uniform mat3 screen;

attribute vec2 pos;
attribute vec2 tex_in;
attribute float mode_in;

varying vec2 tex;
varying float mode;

uniform vec2 translate;
uniform float height;

uniform float one_px;
uniform float aspect;

void main () {
  tex = tex_in;
  mode = mode_in;

  vec2 world = (pos * 1.0 / 1000.0);

  //vec3 p = screen * vec3 (world, 1.0);
  vec3 p = screen * vec3 (translate, 1.0);
  
  vec2 font = vec2 (world.x * one_px * height * aspect, world.y * one_px * height);
  gl_Position = vec4 (font + p.xy, 0.0, p.z);
}
