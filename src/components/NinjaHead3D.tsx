"use client";

import React, { useEffect, useRef, useState } from "react";

const QUIPS = [
  "Scan complete. Lobby's mine.",
  "Queue up. I'm carrying.",
  "One more match. Promise.",
  "GG. Fries on me.",
  "Lag? Not on our fiber.",
  "Respawning in 3… 2…",
];

const BASE = "/models/ninja/";
const DISP_SCALE = 2.436143; // values shipped with the model
const DISP_BIAS = -0.428408;

/**
 * Hero head: the three.js "ninja head" sample model (normal + AO + displacement maps),
 * rendered as dark gunmetal under blood-red rim lights on a transparent canvas.
 * Follows the cursor (or device tilt), drag to spin, click/tap to run a red scan pulse.
 */
export const NinjaHead3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const host = useRef<HTMLDivElement>(null);
  const [quip, setQuip] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { OBJLoader } = await import("three/examples/jsm/loaders/OBJLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      // WebGL availability check (old devices / blocked GPU)
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.matchMedia("(max-width: 768px)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let w = el.clientWidth || 400, h = el.clientHeight || 500;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
      const fit = () => {
        // keep the whole head in frame on tall phones and wide desktops alike
        const t = Math.tan(THREE.MathUtils.degToRad(15));
        const needH = 4.4, needW = 3.6;
        camera.position.set(0, 0.15, Math.max(needH / 2 / t, needW / 2 / t / camera.aspect));
        camera.lookAt(0, 0.05, 0);
      };
      fit();

      /* ── textures + material ── */
      const tl = new THREE.TextureLoader();
      const load = (f: string) => new Promise<InstanceType<typeof THREE.Texture>>((res, rej) => tl.load(BASE + f, res, undefined, rej));
      let obj: InstanceType<typeof THREE.Group>, normalMap, aoMap, dispMap;
      try {
        [obj, normalMap, aoMap, dispMap] = await Promise.all([
          new OBJLoader().loadAsync(BASE + "ninjaHead_Low.obj"),
          load("normal.jpg"),
          load("ao.jpg"),
          load("displacement.jpg"),
        ]);
      } catch {
        if (!disposed) setFailed(true);
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      if (disposed) return;

      const mat = new THREE.MeshStandardMaterial({
        color: 0x3a3b40,
        roughness: 0.32,
        metalness: 1,
        normalMap,
        normalScale: new THREE.Vector2(1, -1),
        aoMap,
        aoMapIntensity: 1,
        displacementMap: dispMap,
        displacementScale: DISP_SCALE,
        displacementBias: DISP_BIAS,
        envMapIntensity: 0.9,
        emissive: 0xff1a0d,
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
      });

      const srcMesh = obj.children[0] as InstanceType<typeof THREE.Mesh>;
      const geo = srcMesh.geometry;
      geo.center();
      geo.computeBoundingSphere();
      const R = geo.boundingSphere!.radius;

      const headPivot = new THREE.Group();
      scene.add(headPivot);
      const head = new THREE.Mesh(geo, mat);
      const k = 1.75 / R;
      head.scale.setScalar(k);
      headPivot.add(head);

      // red scan wireframe that flashes on click / hover
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xff2a1f, wireframe: true, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
      const wire = new THREE.Mesh(geo, wireMat);
      wire.scale.setScalar(k * 1.004);
      headPivot.add(wire);

      // scan ring orbiting the head
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.55, 0.006, 8, 160),
        new THREE.MeshBasicMaterial({ color: 0xff1a0d, transparent: true, opacity: 0.85, toneMapped: false })
      );
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.85, 0.003, 6, 160),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, toneMapped: false })
      );
      ring2.rotation.set(Math.PI / 2 + 0.35, 0.2, 0);
      scene.add(ring2);

      /* ── embers ── */
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
      const N = small ? 60 : 140;
      const pos = new Float32Array(N * 3);
      const spd = new Float32Array(N);
      const seed = (i: number, init: boolean) => {
        const a = Math.random() * Math.PI * 2, r = 1.2 + Math.random() * 1.8;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = init ? -2.5 + Math.random() * 5 : -2.5;
        pos[i * 3 + 2] = Math.sin(a) * r * 0.6 - 0.5;
        spd[i] = 0.004 + Math.random() * 0.012;
      };
      for (let i = 0; i < N; i++) seed(i, true);
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({ map: glowTex, size: 0.09, color: 0xff3a2a, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
      scene.add(new THREE.Points(pGeo, pMat));

      /* ── lights: cool key, hard red rims ── */
      scene.add(new THREE.HemisphereLight(0x8090a8, 0x1a0000, 0.35));
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(2.5, 3, 4);
      scene.add(key);
      const rimL = new THREE.SpotLight(0xff1a0d, 160, 12, 0.7, 0.5);
      rimL.position.set(-3, 1.5, -2.5);
      scene.add(rimL);
      const rimR = new THREE.SpotLight(0xff3a1f, 120, 12, 0.7, 0.5);
      rimR.position.set(3, -0.5, -2.2);
      scene.add(rimR);
      const orbit = new THREE.PointLight(0xff1a0d, 18, 6);
      scene.add(orbit);

      /* ── interaction ── */
      let tx = 0, ty = 0, cx = 0, cy = 0;
      let spin = 0, spinV = 0, drag = false, moved = 0, lx = 0;
      let hover = false, pulse = 0, time = 0;
      const scan = () => {
        pulse = 1;
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
          spinV = dx * 0.01;
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
        if (drag && moved < 8) scan();
        drag = false;
      };
      const onEnter = () => (hover = true);
      const onLeave = () => (hover = false);
      cv.addEventListener("pointerdown", onDown);
      cv.addEventListener("pointerenter", onEnter);
      cv.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      window.addEventListener("pointermove", onMove, { passive: true });
      if (coarse) window.addEventListener("deviceorientation", onOrient);

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

      // context loss (mobile tab switching): stop drawing, show fallback
      const onLost = (e: Event) => { e.preventDefault(); setFailed(true); };
      cv.addEventListener("webglcontextlost", onLost);

      const frame = (dt: number) => {
        time += dt;
        const t = time;
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        if (!drag) { spinV *= 0.92; spin += spinV; spin *= 0.95; }

        headPivot.rotation.y = spin + cx * 0.6 + (reduce ? 0 : Math.sin(t * 0.4) * 0.12);
        headPivot.rotation.x = cy * 0.25;
        headPivot.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.05;

        pulse = Math.max(0, pulse - dt * 0.9);
        const p = Math.sin(pulse * Math.PI);
        mat.displacementScale = DISP_SCALE * (1 + p * 1.6);
        mat.emissiveIntensity = p * 0.35 + (hover ? 0.04 : 0);
        wireMat.opacity = p * 0.55 + (hover ? 0.06 : 0);

        ring.position.y = Math.sin(t * 0.8) * 1.3;
        ring.scale.setScalar(1 + p * 0.25);
        (ring.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = 0.35 + 0.5 * (1 - Math.abs(Math.sin(t * 0.8)));
        ring2.rotation.z = t * 0.3;

        orbit.position.set(Math.cos(t * 0.7) * 2.4, Math.sin(t * 0.5) * 1.2, Math.sin(t * 0.7) * 2.4);
        orbit.intensity = 14 + p * 40;

        for (let i = 0; i < N; i++) {
          pos[i * 3 + 1] += spd[i] * (reduce ? 0.3 : 1) * 60 * dt;
          pos[i * 3] += Math.sin(t + i) * 0.0015;
          if (pos[i * 3 + 1] > 2.6) seed(i, false);
        }
        pGeo.attributes.position.needsUpdate = true;

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

      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __ninja: object }).__ninja = {
          step: (n = 60) => { for (let i = 0; i < n; i++) frame(1 / 60); },
          scan,
          look: (x: number, y: number) => { tx = x; ty = y; },
        };
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        cv.removeEventListener("pointerdown", onDown);
        cv.removeEventListener("pointerenter", onEnter);
        cv.removeEventListener("pointerleave", onLeave);
        cv.removeEventListener("webglcontextlost", onLost);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("deviceorientation", onOrient);
        scene.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>;
          if (m.geometry) m.geometry.dispose();
          const mm = m.material as { dispose?: () => void } | undefined;
          mm?.dispose?.();
        });
        [normalMap, aoMap, dispMap, glowTex].forEach((tx) => tx?.dispose());
        envTex.dispose();
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
        className={`absolute left-1/2 top-[8%] z-20 -translate-x-1/2 whitespace-nowrap px-3 pt-1.5 pb-[0.9rem] bg-[#fff] text-black font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 pointer-events-none ${
          quip ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-2"
        }`}
        style={{ clipPath: "polygon(0 0,100% 0,100% 80%,56% 80%,50% 100%,44% 80%,0 80%)" }}
      >
        {quip}
      </div>
      {!ready && !failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#e10600] animate-ping" />
        </div>
      )}
      {failed && (
        // static fallback when WebGL is unavailable
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/logo-icon-3d.png" alt="" className="absolute inset-0 m-auto w-1/2 h-auto object-contain mix-blend-screen opacity-80" />
      )}
      <div
        ref={host}
        data-cursor
        role="img"
        aria-label="Interactive 3D head. Drag to rotate, tap to scan."
        className={`absolute inset-0 transition-opacity duration-1000 ${ready && !failed ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};
