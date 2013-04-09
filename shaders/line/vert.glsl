uniform mat3 world;
uniform mat3 screen;

attribute vec2 prev;
attribute vec2 current;
attribute vec2 next;

attribute vec3 color_in;
attribute vec2 circle_in;
attribute float alpha_in;
attribute float width;

uniform float px_w;
uniform float px_h;

uniform float ratio;

varying vec2 circle;
varying vec4 color;
varying float alpha;

vec3 rotate90 (in vec3 dir) {
  return vec3 (-dir.y, dir.x, dir.z);
}

float intersect_denom (in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  float denom = a.x * (d.y - c.y) +
    b.x * (c.y - d.y) +
    d.x * (b.y - a.y) +
    c.x * (a.y - b.y);

  return denom;
}

vec3 intersect (in vec3 a, in vec3 b, in vec3 c, in vec3 d, float denom) {
  float num_s = a.x * (d.y - c.y) +
    c.x * (a.y - d.y) +
    d.x * (c.y - a.y);

  float s = num_s / denom;

  vec3 dir = b - a;
  dir *= s;
  
  return a + dir;

}

void main () {

  circle = circle_in;
  color = vec4 (color_in, 1.0);
  alpha = alpha_in;

  vec3 prevScreen = world * vec3 (prev, 1.0); 
  vec3 currentScreen = world * vec3 (current, 1.0); 
  vec3 nextScreen = world * vec3 (next, 1.0); 

  vec3 norm1 = rotate90 (normalize (prevScreen - currentScreen));
  vec3 norm2 = rotate90 (normalize (currentScreen - nextScreen));

  // Sending in double width for now

  vec3 s1 = prevScreen + norm1 * width;
  vec3 s2 = currentScreen + norm1 * width;

  vec3 t1 = nextScreen + norm2 * width;
  vec3 t2 = currentScreen + norm2 * width;

  float denom = intersect_denom (s1, s2, t1, t2);

  vec3 inter;
  // I don't know what the tolerance should be, but there is a singularity at 0.0...
  if (abs (denom) < 10.0)
    inter = s2;
  else
    inter = intersect (s1, s2, t1, t2, denom);

  vec3 pos = screen * inter;

  gl_Position = vec4 (pos.xy, 0.0, 1.0);
  
}
