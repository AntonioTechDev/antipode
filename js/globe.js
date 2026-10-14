// Dotted globe with a light arc between Townsville and Aversa — the two "antipodes" of the brand.
import * as THREE from "three";

const CITIES = {
  townsville: { lat: -19.26, lon: 146.82 },
  aversa: { lat: 40.97, lon: 14.21 },
};
const VIEW = { lat: 12, lon: 82 }; // centre of view: both cities and the arc stay in sight

function ll2v(lat, lon, r = 1) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function decodeMask() {
  const m = window.LANDMASK;
  const bin = atob(m.b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return (lat, lon) => {
    const x = Math.min(m.w - 1, Math.max(0, Math.floor(lon + 180)));
    const y = Math.min(m.h - 1, Math.max(0, Math.floor(90 - lat)));
    const i = y * m.w + x;
    return (bytes[i >> 3] >> (7 - (i & 7))) & 1;
  };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  g.beginPath(); g.arc(32, 32, 26, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createGlobe(canvas) {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 5.2);

  const root = new THREE.Group();   // position / scale (layout + scroll)
  const tilt = new THREE.Group();   // pointer parallax
  const globe = new THREE.Group();  // geography, oriented on VIEW
  root.add(tilt); tilt.add(globe); scene.add(root);
  globe.rotation.set(THREE.MathUtils.degToRad(VIEW.lat), THREE.MathUtils.degToRad(-(90 + VIEW.lon)), 0);

  // occluder: hides the dots on the far side
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.985, 64, 64), new THREE.MeshBasicMaterial({ color: 0x07080b })));

  // land dots (fibonacci sphere filtered by the land mask)
  const isLand = decodeMask();
  const N = coarse ? 22000 : 34000;
  const pos = [], col = [];
  const base = new THREE.Color("#7d8297"), violet = new THREE.Color("#8f7dff"), lime = new THREE.Color("#c6ff3d");
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const v = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
    const lat = THREE.MathUtils.radToDeg(Math.asin(v.y));
    const lon = THREE.MathUtils.radToDeg(Math.atan2(v.z, -v.x)) - 180;
    const lonN = ((lon + 540) % 360) - 180;
    if (lat < -60 || !isLand(lat, lonN)) continue;
    pos.push(v.x, v.y, v.z);
    const rnd = Math.random();
    const c = rnd > 0.985 ? lime : rnd > 0.93 ? violet : base;
    col.push(c.r, c.g, c.b);
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  dotsGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({
    size: coarse ? 0.016 : 0.012, sizeAttenuation: true, map: dotTexture(), alphaTest: 0.5,
    vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false,
  }));
  globe.add(dots);

  // atmosphere (fresnel rim)
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { c: { value: new THREE.Color("#6b5cff") } },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 c; varying vec3 vN; varying vec3 vV;
        void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.2); gl_FragColor = vec4(c, f * .9); }`,
    })
  );
  root.add(atmo);

  // city markers + pulsing rings
  const markers = [];
  Object.values(CITIES).forEach(({ lat, lon }, k) => {
    const p = ll2v(lat, lon, 1.002);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), new THREE.MeshBasicMaterial({ color: 0xc6ff3d }));
    dot.position.copy(p);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.036, 48),
      new THREE.MeshBasicMaterial({ color: 0xc6ff3d, transparent: true, side: THREE.DoubleSide, depthWrite: false })
    );
    ring.position.copy(p);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize());
    globe.add(dot, ring);
    markers.push({ ring, dot, phase: k * 0.5 });
  });

  // great-circle arc, lifted off the surface, with a travelling pulse
  const a = ll2v(CITIES.townsville.lat, CITIES.townsville.lon), b = ll2v(CITIES.aversa.lat, CITIES.aversa.lon);
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const q = new THREE.Vector3().copy(a).lerp(b, t).normalize();
    pts.push(q.multiplyScalar(1 + Math.sin(t * Math.PI) * 0.32));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const arcMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { t: { value: 0 } },
    vertexShader: `varying float vU; void main(){ vU = uv.x; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform float t; varying float vU;
      void main(){
        float head = fract(t);
        float d = vU - head; if (d > 0.) d -= 1.;
        float pulse = exp(d * 14.);
        vec3 base = vec3(.42,.36,1.);
        vec3 hot = vec3(.78,1.,.24);
        gl_FragColor = vec4(mix(base, hot, pulse), .28 + pulse * .9);
      }`,
  });
  globe.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.0045, 8, false), arcMat));

  // two thin orbits with satellites
  const orbits = [];
  [[1.42, 0.35, 0.2], [1.62, -0.5, 0.9]].forEach(([r, tx, tz], k) => {
    const g = new THREE.Group();
    g.rotation.set(tx, 0, tz);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.0016, 6, 200),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
    );
    ring.rotation.x = Math.PI / 2;
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: k ? 0x8f7dff : 0xc6ff3d }));
    g.add(ring, sat);
    root.add(g);
    orbits.push({ sat, r, sp: k ? -0.11 : 0.16, off: k * 2 });
  });

  // ---------- state, layout, loop ----------
  const state = { x: 0, y: 0, scale: 1, spin: 0, intro: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", (e) => {
    pointer.tx = (e.clientX / innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  let layout = { x: 1.15, y: 0, s: 1 };
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    layout = camera.aspect >= 1.15 ? { x: 1.05, y: -0.05, s: 1 } : { x: 0, y: -0.95, s: 0.92 };
  }
  resize();
  addEventListener("resize", resize);

  let paused = false, visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
  const clock = new THREE.Clock();
  let t = 0;
  (function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    if (!paused) t += dt;
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;

    root.position.set(layout.x + state.x, layout.y + state.y, 0);
    root.scale.setScalar(layout.s * state.scale * (0.6 + 0.4 * state.intro));
    tilt.rotation.set(pointer.y * 0.12, pointer.x * 0.2 + Math.sin(t * 0.12) * 0.28 + state.spin, 0);
    arcMat.uniforms.t.value = t * 0.28;
    markers.forEach((m) => {
      const k = (t * 0.7 + m.phase) % 1;
      m.ring.scale.setScalar(1 + k * 2.6);
      m.ring.material.opacity = (1 - k) * 0.9;
    });
    orbits.forEach((o) => {
      const ang = t * o.sp + o.off;
      o.sat.position.set(Math.cos(ang) * o.r, 0, Math.sin(ang) * o.r);
    });
    renderer.render(scene, camera);
  })();

  // screen position of each city (for HTML labels); hidden when on the far side
  const tmp = new THREE.Vector3(), nrm = new THREE.Vector3(), toCam = new THREE.Vector3();
  function project() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    return markers.map(({ dot }) => {
      dot.getWorldPosition(tmp);
      nrm.copy(tmp).sub(root.getWorldPosition(new THREE.Vector3())).normalize();
      toCam.copy(camera.position).sub(tmp).normalize();
      const facing = nrm.dot(toCam);
      tmp.project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * w, y: (-tmp.y * 0.5 + 0.5) * h, visible: facing > 0.15 };
    });
  }

  return { state, project, setPaused(v) { paused = v; } };
}
