"use client";

import React, { useEffect, useRef, useState } from "react";

const QUIPS = [
  "Goggles down. Lobby's mine.",
  "Queue up. I'm carrying.",
  "One more match. Promise.",
  "GG. Fries on me.",
  "Lag? Not on our fiber.",
  "Respawning in 3… 2…",
];

/* ───────── texture helpers: paint onto a sphere's equirect UV by direction ───────── */
type Dir = { x: number; y: number; z: number };
const dirFromUV = (u: number, v: number): Dir => {
  const phi = u * Math.PI * 2;
  const th = v * Math.PI;
  return { x: -Math.cos(phi) * Math.sin(th), y: Math.cos(th), z: Math.sin(phi) * Math.sin(th) };
};
const uvFromDir = (x: number, y: number, z: number) => {
  let phi = Math.atan2(z, -x);
  if (phi < 0) phi += Math.PI * 2;
  return { u: phi / (Math.PI * 2), v: Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI };
};
const G = (a: number, s: number) => Math.exp(-(a * a) / (2 * s * s));
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Skin albedo: tone variation, flushed cheeks/nose, lips, brows, stubble, buzz-cut sides, camo eye band, cheek slash, brow scar. */
function paintSkin(): { color: HTMLCanvasElement; bump: HTMLCanvasElement } {
  const W = 2048, H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const b = document.createElement("canvas");
  b.width = W;
  b.height = H;
  const gb = b.getContext("2d")!;
  const rnd = (a: number, z: number) => a + Math.random() * (z - a);
  const at = (x: number, y: number, z: number) => {
    const { u, v } = uvFromDir(x, y, z);
    return [u * W, v * H] as const;
  };
  const blob = (ctx: CanvasRenderingContext2D, x: number, y: number, z: number, rx: number, ry: number, color: string) => {
    const [px, py] = at(x, y, z);
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(rx, ry);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, color);
    gr.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // base tone + mottling
  g.fillStyle = "#b78466";
  g.fillRect(0, 0, W, H);
  gb.fillStyle = "#808080";
  gb.fillRect(0, 0, W, H);
  for (let i = 0; i < 1400; i++) {
    const x = rnd(0, W), y = rnd(0, H), r = rnd(8, 40);
    g.fillStyle = `rgba(${Math.random() < 0.5 ? "150,92,70" : "205,160,130"},${rnd(0.04, 0.1)})`;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // pores (bump)
  for (let i = 0; i < 90000; i++) {
    gb.fillStyle = `rgba(${Math.random() < 0.5 ? "60,60,60" : "200,200,200"},${rnd(0.15, 0.4)})`;
    gb.fillRect(rnd(0, W), rnd(0, H), rnd(1, 2.4), rnd(1, 2.4));
  }

  // flush: cheeks, nose, ears region, lower forehead
  [[0.42, -0.08, 0.86], [-0.42, -0.08, 0.86]].forEach(([x, y, z]) => blob(g, x, y, z, 150, 90, "rgba(176,74,62,0.28)"));
  blob(g, 0, -0.05, 0.99, 40, 70, "rgba(176,74,62,0.1)");
  // under-eye shadows
  [[0.3, 0.06, 0.95], [-0.3, 0.06, 0.95]].forEach(([x, y, z]) => blob(g, x, y, z, 90, 30, "rgba(70,40,40,0.35)"));

  // lips
  {
    const [cx, cy] = at(0, -0.445, 0.9);
    g.fillStyle = "rgba(128,64,58,0.85)";
    g.beginPath();
    g.ellipse(cx, cy - 6, 78, 14, 0, Math.PI, 0);
    g.ellipse(cx, cy + 4, 70, 18, 0, 0, Math.PI);
    g.fill();
    g.strokeStyle = "rgba(55,25,22,0.9)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(cx - 80, cy);
    g.quadraticCurveTo(cx, cy + 5, cx + 80, cy);
    g.stroke();
  }

  // stubble + buzz-cut via direction masks
  const stubble = (d: Dir) => {
    if (d.z < -0.15) return 0;
    const jaw = smooth(-0.3, -0.55, d.y) * smooth(-0.1, 0.35, d.z + Math.abs(d.x) * 0.3);
    const lip = G(d.y + 0.36, 0.035) * G(d.x, 0.14) * smooth(0.6, 0.85, d.z);
    const side = smooth(-0.05, -0.35, d.y) * smooth(0.45, 0.7, Math.abs(d.x));
    const noLips = 1 - G(d.y + 0.445, 0.05) * G(d.x, 0.17);
    return Math.min(1, jaw + lip + side) * noLips;
  };
  const hair = (d: Dir) => smooth(0.12, 0.3, d.y) * smooth(0.55, 0.75, Math.abs(d.x) + Math.max(0, -d.z) * 0.8);
  for (let i = 0; i < 160000; i++) {
    const u = Math.random(), v = rnd(0.15, 0.85);
    const d = dirFromUV(u, v);
    const s = stubble(d), h = hair(d);
    const k = Math.max(s * 0.8, h);
    if (Math.random() > k) continue;
    g.fillStyle = `rgba(34,24,20,${rnd(0.35, 0.75) * (h > s ? 1 : 0.8)})`;
    const len = rnd(1.2, 3.2);
    g.fillRect(u * W, v * H, len * 0.7, len);
  }

  // brows
  [-1, 1].forEach((sx) => {
    for (let i = 0; i < 260; i++) {
      const t = Math.random();
      const x = sx * (0.14 + t * 0.3);
      const y = 0.29 + Math.sin(t * Math.PI) * 0.03 - t * 0.02 + rnd(-0.012, 0.012);
      const [px, py] = at(x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y)));
      g.strokeStyle = `rgba(30,20,16,${rnd(0.5, 0.95)})`;
      g.lineWidth = rnd(1, 2.2);
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(px + sx * rnd(4, 9), py - rnd(1, 4));
      g.stroke();
    }
  });

  // camo smear across the eye band (operator war paint)
  for (let i = 0; i < 900; i++) {
    const x = rnd(-0.6, 0.6);
    const y = 0.155 + rnd(-0.09, 0.075) * (1 - Math.abs(x) * 0.5);
    const [px, py] = at(x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y)));
    g.fillStyle = `rgba(${Math.random() < 0.85 ? "18,16,16" : "40,36,30"},${rnd(0.05, 0.18)})`;
    g.beginPath();
    g.ellipse(px, py, rnd(10, 30), rnd(4, 10), rnd(-0.2, 0.2), 0, Math.PI * 2);
    g.fill();
  }
  // red slashes under the left eye
  [0, 1].forEach((k) => {
    const [x0, y0] = at(-0.24 - k * 0.07, -0.0, 0.97);
    const [x1, y1] = at(-0.3 - k * 0.07, -0.16, 0.94);
    g.strokeStyle = "rgba(200,10,4,0.9)";
    g.lineCap = "round";
    g.lineWidth = 9;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
    for (let j = 0; j < 40; j++) {
      g.fillStyle = "rgba(200,10,4,0.7)";
      const t = Math.random();
      g.fillRect(x0 + (x1 - x0) * t + rnd(-6, 6), y0 + (y1 - y0) * t + rnd(-5, 5), 2, 2);
    }
  });
  return { color: c, bump: b };
}

function paintEye(): HTMLCanvasElement {
  const W = 512, H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e9e2d8";
  g.fillRect(0, 0, W, H);
  // veins near the edges
  g.strokeStyle = "rgba(170,40,40,0.25)";
  for (let i = 0; i < 40; i++) {
    g.lineWidth = Math.random() * 1.2;
    g.beginPath();
    const x = W * 0.25 + (Math.random() - 0.5) * W * 0.5;
    g.moveTo(x, H * 0.5 + (Math.random() - 0.5) * H * 0.7);
    g.lineTo(x + (Math.random() - 0.5) * 40, H * 0.5 + (Math.random() - 0.5) * H * 0.5);
    g.stroke();
  }
  const cx = W * 0.25, cy = H * 0.5, R = 38;
  const iris = g.createRadialGradient(cx, cy, 6, cx, cy, R);
  iris.addColorStop(0, "#1a0d06");
  iris.addColorStop(0.35, "#5a3215");
  iris.addColorStop(0.8, "#3a200c");
  iris.addColorStop(1, "#120a05");
  g.save();
  g.translate(cx, cy);
  g.scale(1, 2);
  g.fillStyle = iris;
  g.beginPath();
  g.arc(0, 0, R, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 90; i++) {
    const a = Math.random() * Math.PI * 2;
    g.strokeStyle = `rgba(${Math.random() < 0.5 ? "140,90,40" : "20,10,4"},0.5)`;
    g.lineWidth = 0.8;
    g.beginPath();
    g.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
    g.lineTo(Math.cos(a) * R * 0.95, Math.sin(a) * R * 0.95);
    g.stroke();
  }
  g.fillStyle = "#050302";
  g.beginPath();
  g.arc(0, 0, 13, 0, Math.PI * 2);
  g.fill();
  g.restore();
  return c;
}

/**
 * "SPECTRE" — original Virtux operator, a procedurally sculpted soldier bust in Three.js.
 * Displaced-sphere human face with painted skin, tracking + blinking eyes, high-cut helmet,
 * flip-down ballistic goggles, comms headset, neck gaiter and plate carrier.
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
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(26, w / h, 0.1, 100);
      const TARGET = new THREE.Vector3(0, -0.95, 0);
      const fit = () => {
        const t = Math.tan(THREE.MathUtils.degToRad(13));
        camera.position.set(0, -0.2, Math.max(5.6 / 2 / t, 4.6 / 2 / t / camera.aspect));
        camera.lookAt(TARGET);
      };
      fit();

      /* ── materials ── */
      const skinPaint = paintSkin();
      const skinTex = new THREE.CanvasTexture(skinPaint.color);
      skinTex.colorSpace = THREE.SRGBColorSpace;
      skinTex.anisotropy = 8;
      const bumpTex = new THREE.CanvasTexture(skinPaint.bump);
      const eyeTex = new THREE.CanvasTexture(paintEye());
      eyeTex.colorSpace = THREE.SRGBColorSpace;

      const M = {
        skin: new THREE.MeshPhysicalMaterial({
          map: skinTex, bumpMap: bumpTex, bumpScale: 0.6, roughness: 0.58,
          sheen: 0.5, sheenRoughness: 0.5, sheenColor: new THREE.Color(0xff7a5a),
          clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.5,
        }),
        neck: new THREE.MeshPhysicalMaterial({ color: 0xa8775b, roughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color(0xff7a5a), envMapIntensity: 0.4 }),
        eye: new THREE.MeshPhysicalMaterial({ map: eyeTex, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.2 }),
        fabric: new THREE.MeshStandardMaterial({ color: 0x1b1d1a, roughness: 0.96 }),
        shirt: new THREE.MeshStandardMaterial({ color: 0x23261f, roughness: 0.95, side: THREE.DoubleSide }),
        gear: new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.62, metalness: 0.3, envMapIntensity: 0.6 }),
        webbing: new THREE.MeshStandardMaterial({ color: 0x2a2c27, roughness: 0.9 }),
        helmet: new THREE.MeshStandardMaterial({ color: 0x2b2d2a, roughness: 0.72, metalness: 0.15, envMapIntensity: 0.6 }),
        lens: new THREE.MeshPhysicalMaterial({ color: 0x1a0402, metalness: 0.6, roughness: 0.06, clearcoat: 1, emissive: 0xff1a0d, emissiveIntensity: 0.12, envMapIntensity: 1.6 }),
        hole: new THREE.MeshBasicMaterial({ color: 0x020202 }),
        red: new THREE.MeshBasicMaterial({ color: 0xff1a0d, toneMapped: false }),
        blink: new THREE.MeshBasicMaterial({ color: 0xff1a0d, toneMapped: false, transparent: true }),
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

      /* ── torso ── */
      const body = new THREE.Group();
      figure.add(body);
      const torsoProfile = [
        [0.5, -1.15], [0.62, -1.45], [1.0, -1.72], [1.6, -1.95], [2.0, -2.25],
        [2.12, -2.6], [2.06, -3.1], [1.95, -3.8], [1.92, -5.6],
      ].map(([r, y]) => new THREE.Vector2(r, y));
      body.add(mesh(new THREE.LatheGeometry(torsoProfile, 64), M.shirt, [0, 0, -0.05], [0, 0, 0], [1, 1, 0.58]));

      // neck + adam's apple
      body.add(mesh(new THREE.CylinderGeometry(0.52, 0.6, 1.1, 32), M.neck, [0, -1.12, -0.08]));
      body.add(mesh(new THREE.SphereGeometry(0.09, 16, 12), M.neck, [0, -1.18, 0.46], [0, 0, 0], [1, 1.4, 0.8]));

      // neck gaiter with folds
      {
        const gGeo = new THREE.CylinderGeometry(0.56, 0.72, 0.55, 48, 4, true);
        const p = gGeo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), z = p.getZ(i), y = p.getY(i);
          const a = Math.atan2(z, x);
          const k = 1 + Math.sin(a * 9 + y * 6) * 0.035 + Math.sin(a * 4) * 0.02;
          p.setXYZ(i, x * k, y, z * k);
        }
        gGeo.computeVertexNormals();
        body.add(mesh(gGeo, new THREE.MeshStandardMaterial({ color: 0x2c2f28, roughness: 0.97, side: THREE.DoubleSide }), [0, -1.55, -0.02], [0.12, 0, 0]));
      }

      // collar
      [-1, 1].forEach((sx) => {
        body.add(mesh(new RoundedBoxGeometry(0.75, 0.32, 0.06, 2, 0.02), M.shirt, [0.52 * sx, -1.78, 0.48], [-0.9, 0.35 * sx, 0.5 * sx]));
      });

      // upper arms + shoulder pads
      [-1, 1].forEach((sx) => {
        body.add(mesh(new THREE.CylinderGeometry(0.6, 0.52, 2.6, 24), M.shirt, [2.05 * sx, -3.6, -0.15], [0, 0, 0.1 * sx]));
        body.add(mesh(new THREE.SphereGeometry(0.66, 28, 20), M.shirt, [1.95 * sx, -2.35, -0.12], [0, 0, 0], [1, 0.9, 1]));
        body.add(mesh(new RoundedBoxGeometry(0.95, 0.85, 0.2, 3, 0.08), M.gear, [2.1 * sx, -2.95, 0.38], [0, 0.45 * sx, 0.12 * sx]));
        body.add(mesh(new THREE.BoxGeometry(0.5, 0.32, 0.03), M.fabric, [2.12 * sx, -2.95, 0.5], [0, 0.45 * sx, 0.12 * sx]));
      });
      // flag-style patch: red V on the left shoulder pad
      [-1, 1].forEach((k) => body.add(mesh(new THREE.BoxGeometry(0.05, 0.26, 0.02), M.red, [-2.12 + 0.06 * k, -2.95, 0.53], [0, -0.45, 0.4 * k])));

      // plate carrier
      const PZ = 1.0;
      body.add(mesh(new RoundedBoxGeometry(2.35, 1.9, 0.36, 4, 0.1), M.gear, [0, -3.15, PZ]));
      [-2.5, -2.65, -2.8].forEach((y) => body.add(mesh(new THREE.BoxGeometry(2.1, 0.045, 0.03), M.webbing, [0, y, PZ + 0.19])));
      [-0.66, 0, 0.66].forEach((x) => {
        body.add(mesh(new RoundedBoxGeometry(0.54, 0.66, 0.28, 3, 0.06), M.gear, [x, -3.5, PZ + 0.3]));
        body.add(mesh(new THREE.BoxGeometry(0.44, 0.05, 0.02), M.webbing, [x, -3.26, PZ + 0.45]));
      });
      [-1, 1].forEach((sx) => {
        body.add(mesh(new THREE.BoxGeometry(0.36, 1.35, 0.12), M.gear, [0.82 * sx, -2.15, 0.86], [-0.62, 0, -0.06 * sx]));
        body.add(mesh(new THREE.BoxGeometry(0.22, 0.06, 0.04), M.red, [0.82 * sx, -2.25, 0.94], [-0.62, 0, 0]));
      });
      // callsign patch
      body.add(mesh(new THREE.BoxGeometry(0.5, 0.36, 0.04), M.fabric, [0.62, -2.45, PZ + 0.2]));
      [-1, 1].forEach((sx) => body.add(mesh(new THREE.BoxGeometry(0.06, 0.28, 0.02), M.red, [0.62 + 0.07 * sx, -2.45, PZ + 0.23], [0, 0, -0.42 * sx])));
      // radio, antenna, PTT cable
      body.add(mesh(new RoundedBoxGeometry(0.32, 0.52, 0.2, 3, 0.04), M.gear, [-0.86, -2.4, 1.02], [-0.5, 0, 0]));
      body.add(mesh(new RoundedBoxGeometry(0.36, 0.62, 0.24, 3, 0.04), M.gear, [-1.05, -2.15, -0.6]));
      body.add(mesh(new THREE.CylinderGeometry(0.016, 0.024, 1.7, 8), M.gear, [-1.15, -1.15, -0.6], [0, 0, 0.12]));
      const antTip = mesh(new THREE.SphereGeometry(0.04, 10, 8), M.blink, [-1.25, -0.3, -0.6]);
      body.add(antTip);
      body.add(tube([[-0.86, -0.75, 0.15], [-0.98, -1.5, 0.62], [-0.88, -2.2, 1.0]], 0.022, M.gear));

      /* ── head ── */
      const head = new THREE.Group();
      figure.add(head);
      const skull = new THREE.Group();
      const SK = new THREE.Vector3(0.86, 1.04, 0.94);
      skull.scale.copy(SK);
      head.add(skull);

      // sculpted face: displaced unit sphere
      const faceGeo = new THREE.SphereGeometry(1, mobile ? 96 : 140, mobile ? 72 : 110);
      {
        const p = faceGeo.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          const { x, y, z } = v;
          const ax = Math.abs(x);
          const front = smooth(0.0, 0.55, z);
          const front2 = smooth(-0.25, 0.35, z);
          let d = 0;
          d -= 0.04 * G(y - 0.58, 0.16) * front; // flatter forehead
          d += 0.06 * G(y - 0.3, 0.055) * G(x, 0.4) * front; // brow ridge
          d -= 0.12 * G(Math.hypot(ax - 0.3, (y - 0.15) * 1.35), 0.105) * front; // eye sockets
          // nose: dorsum, tip, alae
          const nt = Math.max(0, Math.min(1, (0.26 - y) / 0.44));
          const nwin = smooth(0.3, 0.2, y) * smooth(-0.27, -0.19, y);
          d += nwin * (0.03 + 0.2 * Math.pow(nt, 1.5)) * G(x, 0.045 + 0.035 * nt);
          d += 0.05 * G(Math.hypot(x * 1.15, y + 0.17), 0.06) * front;
          d += 0.055 * G(Math.hypot(ax - 0.1, (y + 0.19) * 1.2), 0.045) * front;
          d -= 0.04 * G(y + 0.255, 0.02) * G(ax - 0.07, 0.05) * front; // nostril shadow line
          // cheeks / cheekbones / temples
          d += 0.065 * G(Math.hypot(ax - 0.48, (y + 0.03) * 1.2), 0.14) * front2;
          d += 0.03 * G(Math.hypot(ax - 0.26, y + 0.27), 0.1) * front;
          d -= 0.035 * G(Math.hypot(ax - 0.42, y + 0.4), 0.1) * front; // cheek hollow
          d -= 0.03 * G(Math.hypot(ax - 0.72, y - 0.32), 0.14) * front2;
          // mouth
          d += 0.035 * G(x, 0.2) * G(y + 0.33, 0.07) * front; // muzzle
          d += 0.04 * G(y + 0.405, 0.032) * G(x, 0.15) * front; // upper lip
          d -= 0.04 * G(y + 0.447, 0.011) * G(x, 0.15) * front; // lip seam
          d += 0.045 * G(y + 0.49, 0.035) * G(x, 0.13) * front; // lower lip
          d -= 0.03 * G(y + 0.59, 0.035) * G(x, 0.16) * front; // mentolabial fold
          d += 0.06 * G(y + 0.83, 0.12) * G(x, 0.28) * front; // chin
          // occiput
          d += 0.05 * G(y - 0.2, 0.3) * smooth(0, -0.6, z);
          v.multiplyScalar(1 + d);
          // jaw taper
          if (y < 0.05) {
            const k = smooth(0.05, -0.95, y);
            v.x *= 1 - 0.2 * Math.pow(k, 1.6);
            v.z *= 1 - 0.06 * k * (z < 0 ? 2.5 : 1);
          }
          p.setXYZ(i, v.x, v.y, v.z);
        }
        faceGeo.computeVertexNormals();
      }
      skull.add(mesh(faceGeo, M.skin));

      // eyes: sit in the sockets, track the cursor
      const eyes: InstanceType<typeof THREE.Group>[] = [];
      const lids: { up: InstanceType<typeof THREE.Mesh>; lo: InstanceType<typeof THREE.Mesh> }[] = [];
      const ER = 0.122;
      [-1, 1].forEach((sx) => {
        const holder = new THREE.Group();
        holder.position.set(0.3 * SK.x * sx, 0.15 * SK.y, 0.8 * SK.z - 0.025);
        head.add(holder);
        const ball = new THREE.Group();
        holder.add(ball);
        const eyeMesh = mesh(new THREE.SphereGeometry(ER, 40, 28), M.eye);
        eyeMesh.rotation.y = 0;
        ball.add(eyeMesh);
        eyes.push(ball);
        const up = mesh(new THREE.SphereGeometry(ER * 1.08, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.neck);
        const lo = mesh(new THREE.SphereGeometry(ER * 1.06, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.neck);
        holder.add(up, lo);
        lids.push({ up, lo });
        // tear-line shadow
        holder.add(mesh(new THREE.TorusGeometry(ER * 1.05, 0.006, 6, 32), M.hole, [0, 0, 0.0], [0, 0, 0], [1, 0.55, 1]));
      });

      // high-cut helmet (tilted back) with rails, NVG shroud and velcro
      const helmet = new THREE.Group();
      helmet.rotation.x = -0.14;
      helmet.position.set(0, 0.06, -0.02);
      skull.add(helmet);
      helmet.add(mesh(new THREE.SphereGeometry(1.13, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.4), M.helmet));
      helmet.add(mesh(new THREE.TorusGeometry(Math.sin(Math.PI * 0.4) * 1.13, 0.035, 8, 64), M.gear, [0, Math.cos(Math.PI * 0.4) * 1.13, 0], [Math.PI / 2, 0, 0]));
      [-1, 1].forEach((sx) => {
        helmet.add(mesh(new THREE.BoxGeometry(0.07, 0.15, 0.9), M.gear, [1.03 * sx, 0.5, -0.05], [0, 0, 0.42 * sx]));
        helmet.add(mesh(new THREE.BoxGeometry(0.04, 0.26, 0.42), M.webbing, [0.82 * sx, 0.78, -0.35], [0, 0.35 * sx, 0.7 * sx]));
        [0.25, -0.05].forEach((zz) => helmet.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 10), M.hole, [0.72 * sx, 0.88, zz], [0, 0, 0.9 * sx])));
      });
      helmet.add(mesh(new RoundedBoxGeometry(0.42, 0.26, 0.14, 3, 0.04), M.gear, [0, 0.62, 0.98], [-0.55, 0, 0]));
      const irLed = mesh(new THREE.SphereGeometry(0.028, 8, 6), M.blink, [0.15, 0.68, 1.05]);
      helmet.add(irLed);
      const strobe = mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), M.blink, [0, 0.9, -0.72], [0.9, 0, 0]);
      helmet.add(strobe);

      // headset cups over the ears + mic boom + chin strap
      [-1, 1].forEach((sx) => {
        skull.add(mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.26, 32), M.gear, [1.02 * sx, 0.02, -0.05], [0, 0, Math.PI / 2]));
        skull.add(mesh(new THREE.TorusGeometry(0.22, 0.022, 8, 32), M.red, [1.16 * sx, 0.02, -0.05], [0, Math.PI / 2, 0]));
        skull.add(tube([[0.96 * sx, -0.25, 0.0], [0.82 * sx, -0.7, 0.3], [0.45 * sx, -0.97, 0.5], [0, -1.02, 0.55]], 0.022, M.webbing));
      });
      skull.add(tube([[-1.05, -0.15, 0.12], [-0.98, -0.5, 0.55], [-0.5, -0.62, 0.92]], 0.03, M.gear));
      skull.add(mesh(new THREE.SphereGeometry(0.07, 16, 12), M.fabric, [-0.48, -0.62, 0.94]));

      // ballistic goggles on a hinge: parked on the helmet, flip down over the eyes
      const gogHinge = new THREE.Group();
      skull.add(gogHinge);
      const gog = new THREE.Group();
      gogHinge.add(gog);
      const GR = 1.07;
      gog.add(mesh(new THREE.CylinderGeometry(GR, GR, 0.3, 64, 1, true, -0.95, 1.9), M.lens, [0, 0.16, 0.0], [0, Math.PI / 2 - 0.0, 0]));
      [0.31, 0.01].forEach((y) =>
        gog.add(mesh(new THREE.TorusGeometry(GR + 0.01, 0.025, 6, 64, 1.9), M.gear, [0, y, 0], [Math.PI / 2, 0, Math.PI / 2 - 0.95 + 0.0]))
      );
      gog.add(mesh(new THREE.TorusGeometry(1.06, 0.045, 6, 64), M.webbing, [0, 0.16, -0.02], [Math.PI / 2, 0, 0], [1, 0.98, 1]));
      gog.add(mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), M.red, [0.62, 0.32, 0.84], [0, 0.6, 0]));
      const GOG_UP = -0.55, GOG_DOWN = 0;
      let gogTarget = GOG_UP;
      gogHinge.rotation.x = GOG_UP;

      /* ── embers + soft smoke ── */
      const makeWisps = (n: number, size: number, opacity: number, color: number, speed: [number, number]) => {
        const pos = new Float32Array(n * 3);
        const spd = new Float32Array(n);
        const seed = (i: number, init: boolean) => {
          const a = Math.random() * Math.PI * 2, r = 1.4 + Math.random() * 2.4;
          pos[i * 3] = Math.cos(a) * r;
          pos[i * 3 + 1] = init ? -5.5 + Math.random() * 8 : -5.5;
          pos[i * 3 + 2] = Math.sin(a) * r * 0.6 - 0.6;
          spd[i] = speed[0] + Math.random() * (speed[1] - speed[0]);
        };
        for (let i = 0; i < n; i++) seed(i, true);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ map: glowTex, size, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })));
        return { pos, spd, seed, geo, n };
      };
      const wisps = [
        makeWisps(mobile ? 70 : 160, 0.16, 0.6, 0xff3a2a, [0.004, 0.016]),
        makeWisps(mobile ? 12 : 26, 1.5, 0.06, 0xff5544, [0.002, 0.006]),
      ];

      /* ── cinematic lights: warm key, cool fill, hard red rims ── */
      scene.add(new THREE.HemisphereLight(0x6a7a90, 0x200404, 0.45));
      const key = new THREE.DirectionalLight(0xffe6d6, 2.1);
      key.position.set(3.5, 3, 4.5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x7f90b0, 0.35);
      fill.position.set(-4, 0.5, 3);
      scene.add(fill);
      const rimL = new THREE.SpotLight(0xff1a0d, 120, 16, 0.6, 0.6);
      rimL.position.set(-3.4, 1.8, -2.4);
      rimL.target.position.set(0, -0.4, 0);
      scene.add(rimL, rimL.target);
      const rimR = new THREE.SpotLight(0xff3a1f, 95, 16, 0.6, 0.6);
      rimR.position.set(3.4, 0.6, -2.2);
      rimR.target.position.set(0, -0.6, 0);
      scene.add(rimR, rimR.target);
      const glowLight = new THREE.PointLight(0xff1a0d, 0, 2.2);
      glowLight.position.set(0, 0.2, 1.6);
      head.add(glowLight);

      /* ── interaction ── */
      let tx = 0, ty = 0, cx = 0, cy = 0, ex = 0, ey = 0;
      let spin = 0, spinV = 0, drag = false, moved = 0, lx = 0;
      let hover = false, glitch = 0, time = 0, blinkT = 2 + Math.random() * 2, blinkK = 0;
      const toggle = () => {
        gogTarget = gogTarget === GOG_UP ? GOG_DOWN : GOG_UP;
        glitch = 1;
        setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
        window.setTimeout(() => !disposed && setQuip(null), 2600);
      };
      const cv = renderer.domElement;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = Math.max(-1.4, Math.min(1.4, ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2.4));
        ty = Math.max(-1.2, Math.min(1.2, ((e.clientY - (r.top + r.height * 0.3)) / window.innerHeight) * 2.2));
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
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        ex += (tx - ex) * 0.25;
        ey += (ty - ey) * 0.25;
        if (!drag) { spinV *= 0.9; spin += spinV; spin *= 0.94; }

        figure.rotation.y = spin + cx * 0.12;
        head.rotation.y = cx * 0.42;
        head.rotation.x = cy * 0.2;
        head.rotation.z = -cx * 0.04;
        if (!reduce) {
          const br = Math.sin(t * 1.5);
          body.scale.set(1 + br * 0.006, 1 + br * 0.01, 1);
          head.position.y = br * 0.025;
          figure.position.y = Math.sin(t * 0.7) * 0.03;
        }

        // eyes look a little further than the head turns
        eyes.forEach((e) => {
          e.rotation.y = ex * 0.32;
          e.rotation.x = ey * 0.22;
        });

        // blink
        blinkT -= dt;
        if (blinkT <= 0) {
          blinkK = 1;
          blinkT = 2.5 + Math.random() * 3.5;
        }
        blinkK = Math.max(0, blinkK - dt * 7);
        const shut = Math.sin(blinkK * Math.PI);
        lids.forEach(({ up, lo }) => {
          up.rotation.x = -0.55 + ey * 0.25 + shut * 0.95;
          lo.rotation.x = 0.85 - shut * 0.35;
        });

        gogHinge.rotation.x += (gogTarget - gogHinge.rotation.x) * 0.12;
        const down = gogTarget === GOG_DOWN;
        const pulse = 0.5 + Math.sin(t * 2.4) * 0.15 + (hover ? 0.25 : 0) + glitch * 0.6;
        M.lens.emissiveIntensity += ((down ? 0.55 + pulse * 0.4 : 0.12) - M.lens.emissiveIntensity) * 0.1;
        glowLight.intensity = down ? 1.2 * pulse : 0;
        M.blink.opacity = Math.sin(t * 5) > 0.6 ? 1 : 0.15;

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
          zoom: (z: number, y = -0.2) => { camera.position.set(0, y, z); camera.lookAt(0, y, 0); },
          state: () => ({ hinge: gogHinge.rotation.x, target: gogTarget }),
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
          const pm = o as InstanceType<typeof THREE.Points>;
          if (pm.isPoints) (pm.material as InstanceType<typeof THREE.PointsMaterial>).dispose();
        });
        Object.values(M).forEach((m) => m.dispose());
        [skinTex, bumpTex, eyeTex, glowTex].forEach((t) => t.dispose());
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
        className={`absolute left-1/2 top-[14%] z-20 -translate-x-1/2 whitespace-nowrap px-3 pt-1.5 pb-[0.9rem] bg-white text-black font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 pointer-events-none ${
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
        aria-label="Spectre, the Virtux operator. Click to flip the goggles."
        className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};
