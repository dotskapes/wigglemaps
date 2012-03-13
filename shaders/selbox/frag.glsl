#ifdef GL_ES
precision highp float;
#endif

varying vec3 edge;

void main () {
     float x = max (abs (edge.x), abs (edge.y));
     gl_FragColor = vec4 (0.0, 1.0, 0.0, .4);
     //if (1.0 - x < STEP)
     //	gl_FragColor.a = 1.0;
}