"use client";

import React, { useEffect, useRef, useState } from "react";

const QUIPS = [
  "Night vision on. Lobby's mine.",
  "Queue up. I'm carrying.",
  "One more match. Promise.",
  "GG. Fries on me.",
  "Lag? Not on our fiber.",
  "Respawning in 3… 2…",
];

/* Mask texture: worn ceramic, rough red V, eye soot, red drip streaks, seams, scratches, stencil. */
function paintMask(): HTMLCanvasElement {
  const W = 1024, H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);

  // base ceramic + edge falloff
  g.fillStyle = "#cdc7bb";
  g.fillRect(0, 0, W, H);
  const edge = g.createRadialGradient(W / 2, H * 0.45, W * 0.15, W / 2, H * 0.45, W * 0.62);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(30,24,20,0.55)");
  g.fillStyle = edge;
  g.fillRect(0, 0, W, H);
  const grime = g.createLinearGradient(0, H * 0.55, 0, H);
  grime.addColorStop(0, "rgba(40,32,26,0)");
  grime.addColorStop(1, "rgba(40,32,26,0.45)");
  g.fillStyle = grime;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? "60,50,42" : "255,250,240"},${rnd(0.03, 0.12)})`;
    g.fillRect(rnd(0, W), rnd(0, H), rnd(1, 3), rnd(1, 3));
  }

  // soot around the eyes
  [0.343, 0.657].forEach((u) => {
    g.save();
    g.translate(u * W, 0.462 * H);
    g.scale(1.5, 0.85);
    const s = g.createRadialGradient(0, 0, 10, 0, 0, 120);
    s.addColorStop(0, "rgba(14,10,8,0.85)");
    s.addColorStop(0.6, "rgba(14,10,8,0.35)");
    s.addColorStop(1, "rgba(14,10,8,0)");
    g.fillStyle = s;
    g.beginPath();
    g.arc(0, 0, 120, 0, Math.PI * 2);
    g.fill();
    g.restore();
  });

  // rough brush stroke helper
  const brush = (pts: [number, number][], width: number, color: string) => {
    g.strokeStyle = color;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = width;
    g.beginPath();
    pts.forEach(([u, v], i) => (i ? g.lineTo(u * W, v * H) : g.moveTo(u * W, v * H)));
    g.stroke();
    // bristle fray
    for (let k = 0; k < 220; k++) {
      const seg = Math.floor(Math.random() * (pts.length - 1));
      const t = Math.random();
      const x = (pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * t) * W;
      const y = (pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * t) * H;
      g.fillStyle = color;
      g.globalAlpha = rnd(0.3, 0.9);
      g.fillRect(x + rnd(-width * 0.7, width * 0.7), y + rnd(-width * 0.5, width * 0.5), rnd(2, 6), rnd(2, 6));
    }
    g.globalAlpha = 1;
    // chips
    for (let k = 0; k < 60; k++) {
      const seg = Math.floor(Math.random() * (pts.length - 1));
      const t = Math.random();
      g.fillStyle = "rgba(205,199,187,0.9)";
      g.fillRect(
        (pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * t) * W + rnd(-width / 3, width / 3),
        (pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * t) * H + rnd(-width / 3, width / 3),
        rnd(2, 7),
        rnd(2, 5)
      );
    }
  };

  // the V: forehead down to the nose bridge
  brush([[0.39, 0.04], [0.5, 0.6], [0.61, 0.04]], 34, "#b80600");
  // red drip streaks from the eyes
  [[0.3, 0.52], [0.7, 0.52]].forEach(([u, v]) => {
    brush([[u, v], [u + rnd(-0.008, 0.008), v + 0.09], [u + rnd(-0.01, 0.01), v + 0.17]], 12, "#7a0400");
    g.fillStyle = "#7a0400";
    g.beginPath();
    g.arc(u * W, (v + 0.18) * H, 9, 0, Math.PI * 2);
    g.fill();
  });

  // seams
  g.strokeStyle = "rgba(25,20,16,0.7)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(0.12 * W, 0.78 * H);
  g.quadraticCurveTo(0.5 * W, 0.92 * H, 0.88 * W, 0.78 * H);
  g.moveTo(0.5 * W, 0.66 * H);
  g.lineTo(0.5 * W, 0.98 * H);
  g.moveTo(0.2 * W, 0.46 * H);
  g.lineTo(0.06 * W, 0.42 * H);
  g.moveTo(0.8 * W, 0.46 * H);
  g.lineTo(0.94 * W, 0.42 * H);
  g.stroke();

  // scratches
  for (let i = 0; i < 70; i++) {
    const x = rnd(0, W), y = rnd(0, H), a = rnd(0, Math.PI), l = rnd(10, 60);
    g.strokeStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.35)" : "rgba(30,24,20,0.35)";
    g.lineWidth = rnd(0.6, 1.6);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }

  // stencil
  g.fillStyle = "rgba(35,28,24,0.75)";
  g.font = "bold 30px monospace";
  g.fillText("VTX-07", 0.68 * W, 0.8 * H);
  return c;
}

/**
 * "SPECTRE" — original Virtux operator mascot, built procedurally in Three.js.
 * Sculpted ceramic V-mask, hood, tactical helmet with flip-down night vision,
 * headset, plate carrier and ghost wisps. Transparent canvas over the hero gradient.
 */
export const Operator3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const host = useRef<HTMLDivElement>(null);
  const [quip, setQuip] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let w = el.clientWidth || 400, h = el.clientHeight || 500;
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
      const TARGET = new THREE.Vector3(0, -0.85, 0);
      const fit = () => {
        const t = Math.tan(THREE.MathUtils.degToRad(15));
        camera.position.set(0, -0.3, Math.max(5.9 / 2 / t, 4.8 / 2 / t / camera.aspect));
        camera.lookAt(TARGET);
      };
      fit();

      /* ── materials ── */
      const maskTex = new THREE.CanvasTexture(paintMask());
      maskTex.colorSpace = THREE.SRGBColorSpace;
      maskTex.anisotropy = 4;
      const M = {
        fabric: new THREE.MeshStandardMaterial({ color: 0x131417, roughness: 0.95 }),
        jacket: new THREE.MeshStandardMaterial({ color: 0x12151b, roughness: 0.92, side: THREE.DoubleSide }),
        gear: new THREE.MeshStandardMaterial({ color: 0x101113, roughness: 0.62, metalness: 0.35, envMapIntensity: 0.6 }),
        webbing: new THREE.MeshStandardMaterial({ color: 0x1e1f22, roughness: 0.9 }),
        helmet: new THREE.MeshStandardMaterial({ color: 0x1c1d21, roughness: 0.48, metalness: 0.25, envMapIntensity: 0.7 }),
        mask: new THREE.MeshPhysicalMaterial({ map: maskTex, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.55, envMapIntensity: 0.35 }),
        hole: new THREE.MeshBasicMaterial({ color: 0x020202 }),
        red: new THREE.MeshBasicMaterial({ color: 0xff1a0d, toneMapped: false }),
        blink: new THREE.MeshBasicMaterial({ color: 0xff1a0d, toneMapped: false, transparent: true }),
        lens: new THREE.MeshStandardMaterial({ color: 0x050505, emissive: 0xff1a0d, emissiveIntensity: 0.15, roughness: 0.15, metalness: 0.6 }),
      };

      const glowTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d")!;
        const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        r.addColorStop(0, "rgba(255,255,255,1)");
        r.addColorStop(0.25, "rgba(255,80,60,0.8)");
        r.addColorStop(1, "rgba(255,0,0,0)");
        g.fillStyle = r;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      })();

      type Geo = ConstructorParameters<typeof THREE.Mesh>[0];
      type Mat = ConstructorParameters<typeof THREE.Mesh>[1];
      type V3 = [number, number, number];
      const mesh = (geo: Geo, mat: Mat, p: V3 = [0, 0, 0], r: V3 = [0, 0, 0], s?: V3) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(...p);
        m.rotation.set(...r);
        if (s) m.scale.set(...s);
        return m;
      };
      const tube = (pts: V3[], radius: number, mat: Mat) =>
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 32, radius, 8), mat);

      const figure = new THREE.Group();
      scene.add(figure);

      /* ── body ── */
      const body = new THREE.Group();
      figure.add(body);
      const torsoProfile = [
        [0.42, -0.7], [0.46, -1.0], [0.75, -1.35], [1.45, -1.72], [1.95, -2.1],
        [2.08, -2.5], [2.02, -3.0], [1.92, -3.7], [1.9, -5.4],
      ].map(([r, y]) => new THREE.Vector2(r, y));
      body.add(mesh(new THREE.LatheGeometry(torsoProfile, 56), M.jacket, [0, 0, 0], [0, 0, 0], [1, 1, 0.56]));
      body.add(mesh(new THREE.TorusGeometry(0.66, 0.28, 16, 32), M.jacket, [0, -1.3, 0.05], [Math.PI / 2 + 0.15, 0, 0]));

      // shoulder armour
      [-1, 1].forEach((sx) => {
        body.add(mesh(new RoundedBoxGeometry(0.95, 0.22, 0.9, 4, 0.1), M.gear, [1.5 * sx, -1.8, 0.02], [0, 0, -0.62 * sx]));
        body.add(mesh(new THREE.BoxGeometry(0.28, 0.025, 0.02), M.red, [1.52 * sx, -1.8, 0.47], [0, 0, -0.62 * sx]));
      });

      // plate carrier
      const PZ = 1.06;
      body.add(mesh(new RoundedBoxGeometry(2.25, 1.85, 0.34, 4, 0.1), M.gear, [0, -2.95, PZ]));
      [-2.32, -2.47, -2.62].forEach((y) => body.add(mesh(new THREE.BoxGeometry(2.0, 0.04, 0.03), M.webbing, [0, y, PZ + 0.18])));
      [-0.62, 0, 0.62].forEach((x) => {
        body.add(mesh(new RoundedBoxGeometry(0.52, 0.62, 0.26, 3, 0.06), M.gear, [x, -3.3, PZ + 0.28]));
        body.add(mesh(new THREE.BoxGeometry(0.42, 0.05, 0.02), M.webbing, [x, -3.07, PZ + 0.42]));
      });
      [-1, 1].forEach((sx) => {
        body.add(mesh(new THREE.BoxGeometry(0.34, 1.25, 0.12), M.gear, [0.78 * sx, -1.95, 0.92], [-0.6, 0, -0.06 * sx]));
        body.add(mesh(new THREE.BoxGeometry(0.2, 0.06, 0.04), M.red, [0.78 * sx, -2.05, 1.0], [-0.6, 0, 0]));
      });
      // chest V patch
      body.add(mesh(new THREE.BoxGeometry(0.46, 0.4, 0.04), M.fabric, [0.62, -2.22, PZ + 0.19]));
      [-1, 1].forEach((sx) => body.add(mesh(new THREE.BoxGeometry(0.06, 0.3, 0.02), M.red, [0.62 + 0.07 * sx, -2.22, PZ + 0.22], [0, 0, -0.42 * sx])));
      // radio + antenna + headset cable
      body.add(mesh(new RoundedBoxGeometry(0.3, 0.5, 0.2, 3, 0.04), M.gear, [-0.82, -2.15, 1.05], [-0.5, 0, 0]));
      body.add(mesh(new RoundedBoxGeometry(0.34, 0.6, 0.24, 3, 0.04), M.gear, [-1.0, -1.95, -0.55]));
      body.add(mesh(new THREE.CylinderGeometry(0.016, 0.024, 1.7, 8), M.gear, [-1.1, -0.95, -0.55], [0, 0, 0.12]));
      const antTip = mesh(new THREE.SphereGeometry(0.04, 10, 8), M.blink, [-1.2, -0.1, -0.55]);
      body.add(antTip);
      body.add(tube([[-0.88, -0.95, 0.2], [-0.98, -1.45, 0.62], [-0.84, -1.95, 1.0]], 0.022, M.gear));

      /* ── head ── */
      const head = new THREE.Group();
      figure.add(head);
      const skull = new THREE.Group();
      skull.scale.set(0.86, 1.05, 0.95);
      head.add(skull);
      skull.add(mesh(new THREE.SphereGeometry(1, 40, 32), M.fabric)); // balaclava
      // hood
      skull.add(mesh(new THREE.SphereGeometry(1.24, 40, 28, Math.PI / 2 + 0.92, Math.PI * 2 - 1.84, 0.75, Math.PI * 0.78), M.jacket, [0, -0.12, -0.06], [0, 0, 0], [1.02, 1.18, 1]));

      // sculpted mask: displaced sphere shell
      const maskGeo = new THREE.SphereGeometry(1.03, 96, 64, Math.PI / 2 - 1.05, 2.1, 0.62, 1.72);
      {
        const p = maskGeo.attributes.position;
        const v = new THREE.Vector3();
        const G = (a: number, s: number) => Math.exp(-(a * a) / (2 * s * s));
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          const n = v.clone().normalize();
          const { x, y } = v;
          let d = 0;
          d += 0.045 * G(y - 0.4, 0.07) * G(x, 0.45); // brow
          d -= 0.075 * G(Math.hypot(Math.abs(x) - 0.33, (y - 0.16) * 1.4), 0.14); // sockets
          d += 0.13 * G(x, 0.065) * G(y + 0.02, 0.17); // nose ridge
          d += 0.04 * G(Math.hypot(Math.abs(x) - 0.46, y + 0.12), 0.13); // cheekbones
          v.addScaledVector(n, d);
          if (v.y < -0.25) v.x *= 1 - 0.2 * Math.min(1, (-0.25 - v.y) / 0.6); // jaw taper
          p.setXYZ(i, v.x, v.y, v.z);
        }
        maskGeo.computeVertexNormals();
      }
      skull.add(mesh(maskGeo, M.mask));

      // eye slits in the sockets + glow
      const eyes: InstanceType<typeof THREE.Sprite>[] = [];
      const eyeCore: InstanceType<typeof THREE.Mesh>[] = [];
      [-1, 1].forEach((sx) => {
        const dir = new THREE.Vector3(0.33 * sx, 0.16, 0.95).normalize();
        const g = new THREE.Group();
        g.position.copy(dir.clone().multiplyScalar(0.955));
        g.lookAt(dir.clone().multiplyScalar(3));
        g.add(mesh(new THREE.CircleGeometry(0.2, 32), M.hole, [0, 0, -0.005], [0, 0, 0], [1.25, 0.62, 1])); // socket shadow
        g.add(mesh(new THREE.BoxGeometry(0.3, 0.07, 0.14), M.hole, [0, 0, 0], [0, 0, -0.22 * sx]));
        const core = mesh(new THREE.BoxGeometry(0.17, 0.032, 0.05), M.red, [0.02 * sx, -0.004, 0.02], [0, 0, -0.22 * sx]);
        g.add(core);
        eyeCore.push(core);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xff2a1f, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, transparent: true }));
        halo.scale.set(0.55, 0.3, 1);
        halo.position.z = 0.1;
        g.add(halo);
        eyes.push(halo);
        skull.add(g);
      });
      // mouth vents
      [-0.46, -0.56, -0.66].forEach((y, i) => {
        const z = Math.sqrt(1.03 * 1.03 - y * y) * 0.98;
        skull.add(mesh(new THREE.BoxGeometry(0.34 - i * 0.06, 0.032, 0.04), M.hole, [0, y, z], [Math.asin(-y / 1.03) * 0.9, 0, 0]));
      });

      // helmet shell + front rim + vents + rails
      skull.add(mesh(new THREE.SphereGeometry(1.13, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.43), M.helmet, [0, 0.1, -0.03]));
      skull.add(mesh(new THREE.TorusGeometry(1.1, 0.05, 8, 48, Math.PI), M.gear, [0, 0.36, -0.03], [Math.PI / 2, 0, 0]));
      [-1, 1].forEach((sx) => {
        skull.add(mesh(new THREE.BoxGeometry(0.08, 0.16, 0.85), M.gear, [1.0 * sx, 0.45, -0.05], [0, 0, 0.35 * sx]));
        [0.3, 0.0, -0.3].forEach((zz) => skull.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 10), M.hole, [0.86 * sx, 0.8, zz], [0, 0, 0.75 * sx])));
        skull.add(mesh(new THREE.BoxGeometry(0.04, 0.22, 0.3), M.webbing, [0.92 * sx, 0.62, -0.45], [0, 0.5 * sx, 0.6 * sx])); // velcro panel
        // headset cups + LED ring
        skull.add(mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 28), M.gear, [1.02 * sx, -0.05, 0], [0, 0, Math.PI / 2]));
        skull.add(mesh(new THREE.TorusGeometry(0.22, 0.022, 8, 32), M.red, [1.15 * sx, -0.05, 0], [0, Math.PI / 2, 0]));
        // chin strap
        skull.add(tube([[0.98 * sx, -0.3, 0.05], [0.8 * sx, -0.75, 0.35], [0.35 * sx, -0.98, 0.55], [0, -1.02, 0.58]], 0.025, M.webbing));
      });
      // rear strobe
      const strobe = mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), M.blink, [0, 0.92, -0.72], [0.9, 0, 0]);
      skull.add(strobe);
      // mic boom
      skull.add(tube([[-1.05, -0.2, 0.15], [-0.95, -0.55, 0.65], [-0.42, -0.74, 1.02]], 0.035, M.gear));
      skull.add(mesh(new THREE.SphereGeometry(0.075, 16, 12), M.gear, [-0.42, -0.74, 1.02]));

      // night-vision rig on a hinge
      skull.add(mesh(new RoundedBoxGeometry(0.42, 0.28, 0.2, 3, 0.04), M.gear, [0, 0.82, 0.78], [-0.75, 0, 0]));
      const irLed = mesh(new THREE.SphereGeometry(0.03, 8, 6), M.blink, [0.16, 0.9, 0.86]);
      skull.add(irLed);
      const nvgHinge = new THREE.Group();
      nvgHinge.position.set(0, 0.9, 0.95);
      skull.add(nvgHinge);
      const nvg = new THREE.Group();
      nvgHinge.add(nvg);
      nvg.add(mesh(new THREE.BoxGeometry(0.2, 0.42, 0.14), M.gear, [0, -0.18, 0.12]));
      [-1, 1].forEach((sx) => {
        nvg.add(mesh(new RoundedBoxGeometry(0.36, 0.34, 0.55, 3, 0.06), M.gear, [0.24 * sx, -0.42, 0.42]));
        nvg.add(mesh(new THREE.BoxGeometry(0.05, 0.05, 0.3), M.webbing, [0.43 * sx, -0.42, 0.42])); // focus knob rail
        nvg.add(mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 24), M.gear, [0.24 * sx, -0.42, 0.74], [Math.PI / 2, 0, 0]));
        nvg.add(mesh(new THREE.CircleGeometry(0.11, 24), M.lens, [0.24 * sx, -0.42, 0.805]));
      });
      const NVG_UP = -0.95, NVG_DOWN = 0.42;
      let nvgTarget = NVG_UP;
      nvgHinge.rotation.x = NVG_UP;

      /* ── ghost wisps: embers + soft smoke ── */
      const makeWisps = (n: number, size: number, opacity: number, color: number, speed: [number, number]) => {
        const pos = new Float32Array(n * 3);
        const spd = new Float32Array(n);
        const seed = (i: number, init: boolean) => {
          const a = Math.random() * Math.PI * 2, r = 1.2 + Math.random() * 2.2;
          pos[i * 3] = Math.cos(a) * r;
          pos[i * 3 + 1] = init ? -5 + Math.random() * 8 : -5;
          pos[i * 3 + 2] = Math.sin(a) * r * 0.6 - 0.4;
          spd[i] = speed[0] + Math.random() * (speed[1] - speed[0]);
        };
        for (let i = 0; i < n; i++) seed(i, true);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pts = new THREE.Points(
          geo,
          new THREE.PointsMaterial({ map: glowTex, size, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        scene.add(pts);
        return { pos, spd, seed, geo, n };
      };
      const wisps = [
        makeWisps(mobile ? 80 : 180, 0.2, 0.55, 0xff3a2a, [0.004, 0.016]),
        makeWisps(mobile ? 14 : 30, 1.4, 0.07, 0xff5544, [0.002, 0.006]),
      ];

      /* ── lights ── */
      scene.add(new THREE.HemisphereLight(0x5a6a80, 0x1a0000, 0.55));
      const key = new THREE.DirectionalLight(0xfff2ea, 1.5);
      key.position.set(4.5, 3.5, 3.5);
      const fill = new THREE.DirectionalLight(0x8090a8, 0.35);
      fill.position.set(-4, 1, 4);
      scene.add(fill);
      scene.add(key);
      const rimL = new THREE.PointLight(0xff1a0d, 55, 14);
      rimL.position.set(-3.2, 1.2, -1.8);
      scene.add(rimL);
      const rimR = new THREE.PointLight(0xff3a1f, 45, 14);
      rimR.position.set(3.2, -0.5, -1.5);
      scene.add(rimR);
      const eyeLight = new THREE.PointLight(0xff1a0d, 0.5, 1.6);
      eyeLight.position.set(0, 0.15, 1.6);
      head.add(eyeLight);

      /* ── interaction ── */
      let tx = 0, ty = 0, cx = 0, cy = 0;
      let spin = 0, spinV = 0, drag = false, moved = 0, lx = 0;
      let hover = false, glitch = 0, time = 0;
      const toggle = () => {
        nvgTarget = nvgTarget === NVG_UP ? NVG_DOWN : NVG_UP;
        glitch = 1;
        setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
        window.setTimeout(() => !disposed && setQuip(null), 2600);
      };
      const cv = renderer.domElement;
      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        if (drag) {
          const dx = e.clientX - lx;
          moved += Math.abs(dx);
          spinV = dx * 0.012;
          spin += spinV;
          lx = e.clientX;
        }
      };
      const onOrient = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        tx = Math.max(-1, Math.min(1, e.gamma / 30));
        ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      };
      const onDown = (e: PointerEvent) => { drag = true; moved = 0; lx = e.clientX; };
      const onUp = () => {
        if (drag && moved < 6) toggle();
        drag = false;
      };
      const onEnter = () => (hover = true);
      const onLeave = () => (hover = false);
      cv.addEventListener("pointerdown", onDown);
      cv.addEventListener("pointerenter", onEnter);
      cv.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("deviceorientation", onOrient);

      const ro = new ResizeObserver(() => {
        w = el.clientWidth; h = el.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        fit();
        renderer.setSize(w, h);
      });
      ro.observe(el);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      const frame = (dt: number) => {
        time += dt;
        const t = time;
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;
        if (!drag) { spinV *= 0.9; spin += spinV; spin *= 0.94; }

        figure.rotation.y = spin + cx * 0.18;
        head.rotation.y = cx * 0.45;
        head.rotation.x = cy * 0.25;
        head.rotation.z = -cx * 0.05;
        if (!reduce) {
          const br = Math.sin(t * 1.6);
          body.scale.set(1 + br * 0.008, 1 + br * 0.012, 1);
          head.position.y = br * 0.03;
          figure.position.y = Math.sin(t * 0.8) * 0.04;
        }

        nvgHinge.rotation.x += (nvgTarget - nvgHinge.rotation.x) * 0.12;
        const down = nvgTarget === NVG_DOWN;
        M.lens.emissiveIntensity += ((down ? 1.2 : 0.15) - M.lens.emissiveIntensity) * 0.1;

        const pulse = 0.75 + Math.sin(t * 2.4) * 0.15 + (hover ? 0.3 : 0) + glitch * 0.8;
        eyes.forEach((s) => (s.material.opacity = down ? pulse * 0.25 : pulse));
        eyeCore.forEach((c) => (c.visible = !(glitch > 0.3 && Math.random() < 0.3)));
        eyeLight.intensity = down ? 0.15 : 0.3 + pulse * 0.35;
        M.blink.opacity = Math.sin(t * 5) > 0.6 ? 1 : 0.15; // strobe / IR / antenna blink

        if (glitch > 0) {
          figure.position.x = (Math.random() - 0.5) * 0.12 * glitch;
          glitch = Math.max(0, glitch - dt * 2.5);
        } else figure.position.x = 0;

        wisps.forEach((wp) => {
          for (let i = 0; i < wp.n; i++) {
            wp.pos[i * 3 + 1] += wp.spd[i] * (reduce ? 0.3 : 1) * 60 * dt;
            wp.pos[i * 3] += Math.sin(t + i) * 0.002;
            if (wp.pos[i * 3 + 1] > 3) wp.seed(i, false);
          }
          wp.geo.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
      };

      const clock = new THREE.Clock();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!visible || document.hidden) return;
        frame(dt);
      };
      loop();
      setReady(true);

      // dev-only hook for visual checks when the tab is backgrounded
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __spectre: object }).__spectre = {
          step: (n = 60) => { for (let i = 0; i < n; i++) frame(1 / 60); },
          toggle,
          look: (x: number, y: number) => { tx = x; ty = y; },
          state: () => ({ hinge: nvgHinge.rotation.x, target: nvgTarget }),
        };
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointerenter", onEnter);
        cv.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("deviceorientation", onOrient);
        scene.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>;
          if (m.geometry) m.geometry.dispose();
          const s = o as InstanceType<typeof THREE.Sprite>;
          if (s.isSprite) s.material.dispose();
        });
        Object.values(M).forEach((m) => m.dispose());
        maskTex.dispose();
        glowTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        cv.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={`relative select-none ${className}`}>
      <div
        className={`absolute left-1/2 top-[22%] z-20 -translate-x-1/2 whitespace-nowrap px-3 pt-1.5 pb-[0.9rem] bg-white text-black font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 pointer-events-none ${
          quip ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-2"
        }`}
        style={{ clipPath: "polygon(0 0,100% 0,100% 80%,56% 80%,50% 100%,44% 80%,0 80%)" }}
      >
        {quip}
      </div>
      {!ready && (
        <div className="absolute inset-0 flex items-end justify-center pb-[30%]">
          <span className="w-2 h-2 rounded-full bg-[#e10600] animate-ping" />
        </div>
      )}
      <div
        ref={host}
        data-cursor
        role="img"
        aria-label="Spectre, the Virtux operator mascot. Click to toggle night vision."
        className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};
