#ifdef GL_ES
precision highp float;
#endif

#define KERNEL 2
#define STD .7
#define PI 3.14159265

uniform sampler2D sampler;

uniform float width;
uniform float height;

uniform float cols;
uniform float rows;

varying vec2 tex;

float round (in float p) {
    float r = floor (p);
    if (abs (r - p) < .5)
        return r;
    else
        return (r + 1.0);
}

vec2 round (in vec2 p) {
    return vec2 (round (p.x), round (p.y));
}

void main () {
    float px = 1.0 / float (width);
    float py = 1.0 / float (height);

    vec2 norm = tex * vec2 (cols, rows);
    vec2 nearest = round (norm);
    //vec2 norm = nearest / vec2 (cols, rows);
    vec2 x = nearest - norm;
    vec4 v = vec4 (0.0, 0.0, 0.0, 0.0);
    float total = 0.0;
    float rad = 2.0 * STD * STD;
    for (int i = -KERNEL; i <= KERNEL; i ++) {
        for (int j = -KERNEL; j <= KERNEL; j ++) {
	     vec2 coord = (nearest + vec2 (j, i)) / vec2 (cols, rows);
             vec4 color = texture2D (sampler, coord);
             float d = length (x + vec2 (j, i));
             float k = exp (-d / rad) / (PI * rad);
             v += color * k;
             total += k;
        }
    }
    v /= total;

    /*vec4 a = texture2D (sampler, (nearest + vec2 (-1.0, 1.0)) / vec2 (cols, rows));
    vec4 b = texture2D (sampler, (nearest + vec2 (0.0, 1.0)) / vec2 (cols, rows));
    vec4 c = texture2D (sampler, (nearest + vec2 (1.0, 1.0)) / vec2 (cols, rows));
    vec4 d = texture2D (sampler, (nearest + vec2 (-1.0, 0.0)) / vec2 (cols, rows));
    vec4 e = texture2D (sampler, (nearest + vec2 (0.0, 0.0)) / vec2 (cols, rows));
    vec4 f = texture2D (sampler, (nearest + vec2 (1.0, 0.0)) / vec2 (cols, rows));
    vec4 g = texture2D (sampler, (nearest + vec2 (-1.0, -1.0)) / vec2 (cols, rows));
    vec4 h = texture2D (sampler, (nearest + vec2 (0.0, -1.0)) / vec2 (cols, rows));
    vec4 i = texture2D (sampler, (nearest + vec2 (1.0, -1.0)) / vec2 (cols, rows));

    float ad = length (x + vec2 (-1.0, 1.0));
    float bd = length (x + vec2 (0.0, 1.0));
    float cd = length (x + vec2 (1.0, 1.0));
    float dd = length (x + vec2 (-1.0, 0.0));
    float ed = length (x + vec2 (0.0, 0.0));
    float fd = length (x + vec2 (1.0, 0.0));
    float gd = length (x + vec2 (-1.0, -1.0));
    float hd = length (x + vec2 (0.0, -1.0));
    float id = length (x + vec2 (1.0, -1.0));

    float RAD = 2.0 * STD * STD;

    float ae = exp (-ad / RAD) / (PI * RAD);
    float be = exp (-bd / RAD) / (PI * RAD);
    float ce = exp (-cd / RAD) / (PI * RAD);
    float de = exp (-dd / RAD) / (PI * RAD);
    float ee = exp (-ed / RAD) / (PI * RAD);
    float fe = exp (-fd / RAD) / (PI * RAD);
    float ge = exp (-gd / RAD) / (PI * RAD);
    float he = exp (-hd / RAD) / (PI * RAD);
    float ie = exp (-id / RAD) / (PI * RAD);
    
    //vec4 v = (ae * a + be * b + ce * c + de * d + ee * e + fe * f + + ge * g + he * h + ie * i) / (ae + be + ce + de + ee + fe + ge + he + ie);
    //vec4 v = (length (x) * cols) * e + ((1.0 - length (x) * cols) * f);
    //vec4 v = vec4 (x, 0.0, 1.0);
    //vec4 v = (a * ae + b * be + c * ce + d * de + e * ee + f * fe + g * ge + h * he + i * ie) / (ae + be + ce + de + ee + fe + ge + he + ie);*/
    gl_FragColor = v;

    //gl_FragColor = vec4 (length (e - f), .0, .0, 1.0);
}

//void main () {
//  gl_FragColor = texture2D (sampler, tex);
//}

