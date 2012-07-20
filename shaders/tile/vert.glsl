uniform mat3 screen;

attribute vec2 pos;
attribute vec2 tex_in;
attribute float lookup_in;
//attribute vec3 color_in;
//attribute float alpha_in;

//varying vec4 color;
varying vec2 tex;
varying float lookup_raw;

void main () {
     tex = tex_in;
     lookup_raw = lookup_in;
     //color = vec4 (color_in, alpha_in);
     vec3 p = screen * vec3 (pos, 1.0);
     gl_Position = vec4 (p.xy, 0.0, 1.0);
}