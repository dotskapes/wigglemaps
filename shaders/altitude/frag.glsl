#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D elevation;
uniform sampler2D background;

varying vec2 tex;
varying vec2 tex2;

uniform float pix_w;
uniform float pix_h;

varying vec3 world_p;
vec3 light = vec3 (0.0, 90.0, 25.0);

void main () {
    float dx = texture2D (elevation, tex + vec2 (pix_w, 0.0)).r - texture2D (elevation, tex - vec2 (pix_w, 0.0)).r;
    float dy = texture2D (elevation, tex + vec2 (0.0, pix_h)).r - texture2D (elevation, tex - vec2 (0.0, pix_h)).r;
    vec3 x = vec3 (.5, 0.0, dx);
    vec3 y = vec3 (0.0, .5, dy);
    vec3 dir = normalize (cross (x, y));
    //    gl_FragColor = texture2D (elevation, tex) * texture2D (background, tex2);
    //        gl_FragColor = vec4 (dir + 1.0 / 2.0, 1.0);
    //	return;
    vec3 norm = normalize (light - world_p);
    //vec3 norm = vec3 (0.0, 0.0, 1.0);
    float n = dot (dir, norm);
    //gl_FragColor = vec4 (dir + 1.0 / 2.0, 1.0);
    vec4 color = texture2D (background, tex2);
    gl_FragColor = clamp (vec4 (color.rgb * n + color.rgb * .5, 1.0), 0.0, 1.0);
}