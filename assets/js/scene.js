/* =========================================================
   Hero 3D — campo di particelle che ondeggia lentamente.
   Sobrio: niente logo, solo profondità e movimento.
   ========================================================= */
import * as THREE from 'three';

const canvas = document.getElementById('scene');
const hero = document.getElementById('hero');

function init() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return; // WebGL non disponibile: resta lo sfondo in CSS
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.6, 10);

  /* ---------- Campo di particelle ---------- */
  const COLS = isMobile ? 120 : 220;
  const ROWS = isMobile ? 56 : 90;
  const geo = new THREE.PlaneGeometry(40, 18, COLS, ROWS);
  geo.rotateX(-Math.PI / 2);

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: reduceMotion ? 1 : 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uColorA: { value: new THREE.Color(0x0f4580) },
      uColorB: { value: new THREE.Color(0x9fd0ff) },
    },
    vertexShader: /* glsl */`
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vH;
      varying float vFade;
      void main() {
        vec3 p = position;
        float t = uTime * 0.35;
        // il campo sale dolcemente verso destra, bilanciando il testo a sinistra
        float rise = smoothstep(-14.0, 16.0, p.x);
        float h = sin(p.x * 0.28 + t) * 0.55
                + sin(p.z * 0.45 + t * 1.25) * 0.32
                + sin((p.x + p.z) * 0.18 - t * 0.8) * 0.42;
        h *= mix(0.7, 1.35, rise);
        p.y += h + rise * 2.6;
        vH = h;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(2.2 + h * 0.9, 0.8) * uPixelRatio * (9.0 / -mv.z);
        vFade = smoothstep(22.0, 7.0, -mv.z);
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uOpacity;
      varying float vH;
      varying float vFade;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uColorA, uColorB, clamp(vH * 0.6 + 0.5, 0.0, 1.0));
        gl_FragColor = vec4(col, a * vFade * 0.7 * uOpacity);
      }
    `,
  });

  const wave = new THREE.Points(geo, mat);
  wave.position.set(1.5, -3.4, -4);
  scene.add(wave);

  /* ---------- Layout ---------- */
  function layout() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  layout();
  window.addEventListener('resize', layout);

  /* ---------- Input: leggera parallasse col mouse e allo scroll ---------- */
  const mouse = new THREE.Vector2();
  const mouseTarget = new THREE.Vector2();
  window.addEventListener('pointermove', (e) => {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollP = 0;
  window.addEventListener('scroll', () => {
    scrollP = Math.min(window.scrollY / hero.clientHeight, 1);
  }, { passive: true });

  /* ---------- Loop ---------- */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  const clock = new THREE.Clock();
  let introStart = null;

  function render() {
    const t = clock.getElapsedTime();
    // la dissolvenza parte insieme alle animazioni del testo
    if (introStart === null && document.body.classList.contains('is-loaded')) introStart = t;
    const intro = reduceMotion ? 1 : introStart === null ? 0 : Math.min((t - introStart) / 2.4, 1);
    const fade = 1 - Math.pow(1 - intro, 3);

    mouse.lerp(mouseTarget, 0.04);

    mat.uniforms.uTime.value = reduceMotion ? 0 : t;
    mat.uniforms.uOpacity.value = fade * (1 - scrollP * 0.6);

    camera.position.x = mouse.x * 0.35;
    camera.position.y = 0.6 - mouse.y * 0.2 - scrollP * 1.2;
    camera.position.z = 10 - scrollP * 1.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    render();
    window.addEventListener('resize', render);
  } else {
    renderer.setAnimationLoop(() => { if (visible) render(); });
  }
}

if (canvas && hero) init();
