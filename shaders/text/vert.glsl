uniform mat3 world;
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

// Specify how text is positioned with respect to the world or screen
uniform int xmode;
uniform int ymode;

void main () {
  tex = tex_in;
  mode = mode_in;

  // Relative position of the text in text space
  vec2 relPos = pos / 1000.0;
  
  // Relative pixel position of vertex
  vec2 relPxPos = relPos * height;

  // Position of anchor in pixel space: left-aligned
  vec3 basePxPos = (world * vec3(translate, 1.0));

  // Vertical center the text
  basePxPos -= vec3(0.0, height / 2.0, 0.0);

  // TEST: Register x position in px space
  basePxPos.x = translate.x;

  // Transform the vertex to screen space
  vec3 screenPos = screen * (basePxPos + vec3(relPxPos, 0.0));

  gl_Position = vec4(screenPos.xy, 0.0, screenPos.z);


  /*vec2 world = (pos * 1.0 / 1000.0);

  //vec3 p = screen * vec3 (world, 1.0);
  vec3 p = screen * vec3 (translate, 1.0);
  
  vec2 font = vec2 (world.x * one_px * height * aspect, world.y * one_px * height);
  gl_Position = vec4 (font + p.xy - vec2(0.0, one_px * height / 2.0), 0.0, p.z);*/
}
