precision highp float;

// Stable monochrome grain preserves the soft finish without animated static.
void main() {
  vec2 p = floor(gl_FragCoord.xy);
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  float grain = fract((p3.x + p3.y) * p3.z);
  gl_FragColor = vec4(vec3(grain), 1.0);
}
