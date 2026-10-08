// The hero 3D object: an oversized mechanical keycap with a "</>" legend.
// Plays the role of the jar in the reference: it rises, spins and tilts with scroll.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const LIME = "#d9ff3f";
const INK = 0x10132a;

function legendTexture(draw, size = 1024) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function taperedKeyGeometry(w, h, d, taper) {
  const geo = new RoundedBoxGeometry(w, h, d, 8, 0.26);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = (y + h / 2) / h; // 0 bottom → 1 top
    const s = 1 - taper * t;
    p.setX(i, p.getX(i) * s);
    p.setZ(i, p.getZ(i) * s);
  }
  geo.computeVertexNormals();
  return geo;
}

export async function createKey(canvas) {
  try { await document.fonts.load('800 300px "Bricolage Grotesque"'); } catch (e) { /* fallback font */ }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const coarse = matchMedia("(pointer: coarse)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  // lights: warm key, lime + lilac rims for the brand glow
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 6); scene.add(key);
  const rimL = new THREE.PointLight(0xd9ff3f, 18, 20); rimL.position.set(-4, 1.5, -1.5); scene.add(rimL);
  const rimR = new THREE.PointLight(0xb6a4ff, 22, 20); rimR.position.set(4, -2, -1); scene.add(rimR);

  // ---------- keycap ----------
  const W = 2.2, H = 1.25, TAPER = 0.2;
  const group = new THREE.Group();
  const pivot = new THREE.Group(); // pivot gets scroll transforms, group gets idle float
  pivot.add(group);
  scene.add(pivot);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: INK, roughness: 0.42, metalness: 0.0, envMapIntensity: 0.28,
    clearcoat: 1, clearcoatRoughness: 0.22, sheen: 0.15, sheenColor: new THREE.Color(0x6d5cff),
  });
  const body = new THREE.Mesh(taperedKeyGeometry(W, H, W, TAPER), bodyMat);
  group.add(body);

  // top legend "</>"
  const topTex = legendTexture((g, s) => {
    g.clearRect(0, 0, s, s);
    g.fillStyle = LIME;
    g.textAlign = "center"; g.textBaseline = "middle";
    g.font = `800 ${s * 0.36}px "Bricolage Grotesque", Arial Black, sans-serif`;
    g.fillText("</>", s / 2, s * 0.47);
    g.font = `700 ${s * 0.062}px "Space Mono", monospace`;
    g.fillText("ANTIPODE STUDIO", s / 2, s * 0.76);
    g.strokeStyle = LIME; g.lineWidth = s * 0.008;
    g.setLineDash([s * 0.02, s * 0.018]);
    g.strokeRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
  });
  const topW = W * (1 - TAPER) - 0.36;
  const top = new THREE.Mesh(
    new THREE.PlaneGeometry(topW, topW),
    new THREE.MeshStandardMaterial({ map: topTex, transparent: true, roughness: 0.5, emissive: new THREE.Color(LIME), emissiveMap: topTex, emissiveIntensity: 0.35 })
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = H / 2 + 0.003;
  group.add(top);

  // front legend: "ENTER ⏎"-like label on the sloped face
  const frontTex = legendTexture((g, s) => {
    g.clearRect(0, 0, s, s);
    g.fillStyle = LIME;
    g.textAlign = "center"; g.textBaseline = "middle";
    g.font = `700 ${s * 0.11}px "Space Mono", monospace`;
    g.fillText("BUILD", s * 0.44, s / 2);
    // hand-drawn return arrow (the glyph is missing from Space Mono)
    g.strokeStyle = LIME; g.lineWidth = s * 0.014; g.lineCap = "round"; g.lineJoin = "round";
    const ax = s * 0.7, ay = s * 0.5, u = s * 0.035;
    g.beginPath(); g.moveTo(ax + u * 1.6, ay - u * 1.4); g.lineTo(ax + u * 1.6, ay); g.lineTo(ax - u, ay);
    g.moveTo(ax - u * 0.1, ay - u * 0.8); g.lineTo(ax - u, ay); g.lineTo(ax - u * 0.1, ay + u * 0.8); g.stroke();
  }, 512);
  const slope = Math.atan((W / 2) * TAPER / H);
  const frontW = W * (1 - TAPER / 2) - 0.5;
  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(frontW, frontW * 0.5),
    new THREE.MeshStandardMaterial({ map: frontTex, transparent: true, emissive: new THREE.Color(LIME), emissiveMap: frontTex, emissiveIntensity: 0.3 })
  );
  front.position.set(0, -0.02, (W / 2) * (1 - TAPER / 2) + 0.006);
  front.rotation.x = -slope;
  group.add(front);

  // Cherry-style cross stem underneath (visible when the key flips)
  const stemMat = new THREE.MeshPhysicalMaterial({ color: 0xd9ff3f, roughness: 0.3, clearcoat: 1, emissive: 0x4c5c00, emissiveIntensity: 0.3 });
  const stemA = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.5, 0.16, 3, 0.04), stemMat);
  const stemB = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.5, 0.62, 3, 0.04), stemMat);
  const stemBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 40), bodyMat);
  stemA.position.y = stemB.position.y = -H / 2 - 0.25;
  stemBase.position.y = -H / 2 - 0.02;
  group.add(stemBase, stemA, stemB);

  // floating lime "pixels" orbiting the key
  const bits = new THREE.Group();
  const bitGeo = new RoundedBoxGeometry(0.16, 0.16, 0.16, 2, 0.03);
  const bitMats = [
    new THREE.MeshStandardMaterial({ color: 0xd9ff3f, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0xb6a4ff, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }),
  ];
  const BITS = coarse ? 8 : 14;
  for (let i = 0; i < BITS; i++) {
    const m = new THREE.Mesh(bitGeo, bitMats[i % 3]);
    const a = (i / BITS) * Math.PI * 2;
    const r = 2.1 + (i % 4) * 0.35;
    m.userData = { a, r, y: (Math.random() - 0.5) * 2.2, sp: 0.15 + Math.random() * 0.25, s: 0.5 + Math.random() * 0.9 };
    m.scale.setScalar(m.userData.s);
    bits.add(m);
  }
  pivot.add(bits);

  // ---------- state animated by GSAP ----------
  const state = { x: 0, y: -5, z: 0, rx: 0.55, ry: -0.5, rz: 0.08, scale: 1, bits: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let paused = false;
  let visible = true;
  let mobileScale = 1;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mobileScale = w < 760 ? 0.62 : w < 1100 ? 0.82 : 1;
  }
  resize();
  window.addEventListener("resize", resize);

  // pause rendering while the stage is covered / offscreen
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock();
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    if (!paused) t += dt;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    const xs = camera.aspect < 1 ? 0.45 : 1; // pull towards centre on portrait screens
    const yo = camera.aspect < 1 ? 0.75 : 0; // portrait: lift the key off the bottom copy
    pivot.position.set(state.x * xs, state.y + yo, state.z);
    pivot.rotation.set(state.rx + pointer.y * 0.12, state.ry + pointer.x * 0.25, state.rz);
    pivot.scale.setScalar(state.scale * mobileScale);

    group.position.y = Math.sin(t * 1.3) * 0.08;
    group.rotation.z = Math.sin(t * 0.9) * 0.03;

    bits.children.forEach((m, i) => {
      const u = m.userData;
      const a = u.a + t * u.sp;
      m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t + i) * 0.15, Math.sin(a) * u.r);
      m.rotation.set(t * u.sp * 2, t * u.sp * 3, 0);
      m.scale.setScalar(u.s * state.bits);
    });

    renderer.render(scene, camera);
  }
  frame();

  return {
    state,
    setPaused(v) { paused = v; },
  };
}
