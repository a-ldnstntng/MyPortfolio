export const recursiveErosionSource = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Recursive Erosion Particle Sphere</title>
<style>
  html, body { width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0; overflow: hidden; background: #000000; }
  #stage { position: fixed; inset: 0; display: block; }
  canvas { display: block; width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="stage"></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"></script>
<script>
(function () {
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 1);
  document.getElementById('stage').appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 3.4);

  // 26,000 points on a Fibonacci sphere for uniform, silky distribution
  var COUNT = 26000;
  var positions = new Float32Array(COUNT * 3);
  var scales = new Float32Array(COUNT);
  var seeds = new Float32Array(COUNT);

  var phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (var i = 0; i < COUNT; i++) {
    var y = 1 - (i / (COUNT - 1)) * 2; // y goes from 1 to -1
    var radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    var theta = phi * i;

    var r = 1.35 * (0.97 + Math.random() * 0.06);
    positions[i * 3] = Math.cos(theta) * radiusAtY * r;
    positions[i * 3 + 1] = y * r;
    positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;

    scales[i] = 0.65 + Math.random() * 0.7;
    seeds[i] = Math.random();
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  var vertexShader = [
    'attribute float aScale;',
    'attribute float aSeed;',
    'uniform float uTime;',
    'varying float vIntensity;',
    'varying float vAlpha;',
    'varying float vDist;',
    '',
    '// Simplex 3D Noise by Ashima Arts',
    'vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }',
    'vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }',
    '',
    'float snoise(vec3 v){',
    '  const vec2 C = vec2(1.0/6.0, 1.0/3.0);',
    '  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);',
    '  vec3 i  = floor(v + dot(v, C.yyy));',
    '  vec3 x0 = v - i + dot(i, C.xxx);',
    '  vec3 g = step(x0.yzx, x0.xyz);',
    '  vec3 l = 1.0 - g;',
    '  vec3 i1 = min(g.xyz, l.zxy);',
    '  vec3 i2 = max(g.xyz, l.zxy);',
    '  vec3 x1 = x0 - i1 + 1.0 * C.xxx;',
    '  vec3 x2 = x0 - i2 + 2.0 * C.xxx;',
    '  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;',
    '  i = mod(i, 289.0);',
    '  vec4 p = permute(permute(permute(',
    '             i.z + vec4(0.0, i1.z, i2.z, 1.0))',
    '           + i.y + vec4(0.0, i1.y, i2.y, 1.0))',
    '           + i.x + vec4(0.0, i1.x, i2.x, 1.0));',
    '  float n_ = 0.142857142857;',
    '  vec3  ns = n_ * D.wyz - D.xzx;',
    '  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);',
    '  vec4 x_ = floor(j * ns.z);',
    '  vec4 y_ = floor(j - 7.0 * x_);',
    '  vec4 x = x_ * ns.x + ns.yyyy;',
    '  vec4 y = y_ * ns.x + ns.yyyy;',
    '  vec4 h = 1.0 - abs(x) - abs(y);',
    '  vec4 b0 = vec4(x.xy, y.xy);',
    '  vec4 b1 = vec4(x.zw, y.zw);',
    '  vec4 s0 = floor(b0) * 2.0 + 1.0;',
    '  vec4 s1 = floor(b1) * 2.0 + 1.0;',
    '  vec4 sh = -step(h, vec4(0.0));',
    '  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;',
    '  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;',
    '  vec3 p0 = vec3(a0.xy, h.x);',
    '  vec3 p1 = vec3(a0.zw, h.y);',
    '  vec3 p2 = vec3(a1.xy, h.z);',
    '  vec3 p3 = vec3(a1.zw, h.w);',
    '  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));',
    '  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;',
    '  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);',
    '  m = m * m;',
    '  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));',
    '}',
    '',
    'void main() {',
    '  vec3 dir = normalize(position);',
    '  float len0 = length(position);',
    '',
    '  // Domain-warped recursive erosion field',
    '  float t = uTime * 0.14;',
    '  vec3 q = dir * 1.65 + vec3(t * 0.55, t * 0.35, t * 0.2);',
    '  float n1 = snoise(q);',
    '',
    '  vec3 r = dir * 2.65 + vec3(n1 * 1.35) + vec3(-t * 0.4, t * 0.25, -t * 0.3);',
    '  float n2 = snoise(r);',
    '',
    '  // Sharp organic erosion ridges/filaments',
    '  float ridge = abs(sin((n2 + dir.y * 0.45) * 5.0 + aSeed * 0.2));',
    '  float trail = 1.0 - smoothstep(0.0, 0.16, ridge);',
    '',
    '  // Hollow cavities and eroded valleys',
    '  float cavity = smoothstep(-0.25, 0.45, n1);',
    '',
    '  vIntensity = trail;',
    '  // Particles in trails are bright and clear; background shell particles are quiet silver',
    '  vAlpha = mix(0.18, 0.95, trail) * (1.0 - cavity * 0.7);',
    '',
    '  // Gentle displacement along trail ribbons',
    '  float disp = (trail * 0.11 - cavity * 0.07) * aScale;',
    '  vec3 newPos = dir * (len0 + disp);',
    '',
    '  vec4 mv = modelViewMatrix * vec4(newPos, 1.0);',
    '  vDist = -mv.z;',
    '',
    '  // Point size: small crisp sparks (2.5px to 8.5px), never giant blinding clouds',
    '  float pSize = mix(24.0, 52.0, trail) * aScale;',
    '  gl_PointSize = clamp(pSize / -mv.z, 2.0, 9.0);',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\\n');

  var fragmentShader = [
    'varying float vIntensity;',
    'varying float vAlpha;',
    'uniform vec3 uColorBase;',
    'uniform vec3 uColorTrail;',
    'uniform vec3 uColorHot;',
    '',
    'void main() {',
    '  vec2 coord = gl_PointCoord - vec2(0.5);',
    '  float dist = length(coord);',
    '  if (dist > 0.5) discard;',
    '',
    '  // Smooth anti-aliased circular dot with soft core',
    '  float shape = smoothstep(0.5, 0.12, dist);',
    '',
    '  // Monochrome / Black & White / Sand palette:',
    '  // Low energy: quiet muted silver-charcoal (#505050)',
    '  // Trails: glowing crisp Sand (#F0EDE5) and brilliant White (#FFFFFF)',
    '  vec3 col = mix(uColorBase, uColorTrail, pow(vIntensity, 1.4));',
    '  col = mix(col, uColorHot, pow(vIntensity, 3.2));',
    '',
    '  gl_FragColor = vec4(col, shape * vAlpha);',
    '}'
  ].join('\\n');

  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColorBase: { value: new THREE.Color('#484848') },
      uColorTrail: { value: new THREE.Color('#F0EDE5') },
      uColorHot: { value: new THREE.Color('#FFFFFF') }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  var points = new THREE.Points(geometry, material);
  scene.add(points);

  var targetX = 0;
  var targetY = 0;

  function onPointerMove(clientX, clientY) {
    targetX = (clientX / window.innerWidth - 0.5) * 0.7;
    targetY = (clientY / window.innerHeight - 0.5) * 0.5;
  }

  window.addEventListener('pointermove', function (e) {
    onPointerMove(e.clientX, e.clientY);
  });

  // Also catch pointer movement on parent window so interaction is seamless
  try {
    if (window.parent && window.parent !== window) {
      window.parent.addEventListener('pointermove', function (e) {
        onPointerMove(e.clientX, e.clientY);
      });
    }
  } catch (err) {}

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  var clock = new THREE.Clock();
  var speed = prefersReducedMotion ? 0.2 : 1.0;

  function tick() {
    var elapsed = clock.getElapsedTime();
    var t = elapsed * speed;
    material.uniforms.uTime.value = t;

    // Organic compound sphere rotation
    points.rotation.y = t * 0.16;
    points.rotation.x = Math.sin(t * 0.11) * 0.22;
    points.rotation.z = Math.cos(t * 0.09) * 0.08;

    // Smooth inertia tilt toward pointer
    points.position.x += (targetX - points.position.x) * 0.045;
    points.position.y += (-targetY - points.position.y) * 0.045;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>
</body>
</html>`;