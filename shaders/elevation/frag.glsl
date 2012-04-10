#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D elevation;

varying vec2 tex;

void main () {
    float value = texture2D (elevation, tex).r;
    if (value < 1.0 / 6.0) {
        gl_FragColor = vec4 (.0, .4, .37, 1.0);
    }
    else if (value < 2.0 / 6.0) {
        gl_FragColor = vec4 (.35, .71, .67, 1.0);
    }
    else if (value < 3.0 / 6.0) {
        gl_FragColor = vec4 (.78, .92, .9, 1.0);
    }
    else if (value < 4.0 / 6.0) {
        gl_FragColor = vec4 (.96, .91, .76, 1.0);
    }
    else if (value < 5.0 / 6.0) {
        gl_FragColor = vec4 (.85, .7, .4, 1.0);
    }
    else {
        gl_FragColor = vec4 (.55, .32, .04, 1.0);
    }
}