uniform mat3 screen;

attribute vec2 pos;
attribute vec3 color_in;
attribute float alpha_in;

varying vec4 color;

void main () {
     color = vec4 (color_in, alpha_in);
     vec3 p = screen * vec3 (pos, 1.0);
     gl_Position = vec4 (p.xy, 0.0, 1.0);
}