"use client";

import React, { useEffect, useRef } from "react";

/**
 * Live 3D Virtux icon (V+X blades + triangle gems), blood-red palette.
 * Three.js is imported lazily so it only ships where this component mounts.
 * Transparent canvas (no backdrop, no bloom halo) so it sits cleanly on any background.
 */
export const Logo3D: React.FC<{ className?: string; scrollSpin?: boolean }> = ({ className = "", scrollSpin = false }) => {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      let w = el.clientWidth || 300, h = el.clientHeight || 300;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true });
      } catch {
        return; // no WebGL: leave the slot empty
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.matchMedia("(max-width: 768px)").matches ? 1.5 : 2));
      renderer.setSize(w, h);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;

      const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
      const fit = () => (camera.position.z = Math.max(17, 18 / camera.aspect));
      fit();

      /* geometry traced from the original mark (1024² px space, y down) */
      const S = 1 / 95, CX = 512, CY = 405;
      type Pt = [number, number];
      const P = (pts: Pt[]) => {
        const s = new THREE.Shape();
        pts.forEach(([x, y], i) => (i ? s.lineTo((x - CX) * S, -(y - CY) * S) : s.moveTo((x - CX) * S, -(y - CY) * S)));
        s.closePath();
        return s;
      };
      const centroid = (pts: Pt[]): Pt => pts.reduce<Pt>((a, [x, y]) => [a[0] + x / pts.length, a[1] + y / pts.length], [0, 0]);
      const grow = (pts: Pt[], k: number): Pt[] => {
        const [cx, cy] = centroid(pts);
        return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
      };

      const blades: { pts: Pt[]; z: number; a: boolean }[] = [
        { pts: [[140,168],[300,168],[318,200],[440,470],[452,500],[398,560],[350,505],[362,470],[255,300],[205,280]], z: 0, a: true },
        { pts: [[885,168],[728,168],[700,205],[470,500],[398,560],[478,560],[512,520],[770,290],[820,270]], z: 0.12, a: false },
        { pts: [[548,350],[612,318],[650,370],[775,632],[700,632],[600,470]], z: 0.3, a: false },
      ];
      const triTop = { outer: [[380,168],[645,168],[512,318]] as Pt[], inner: [[430,192],[595,192],[512,285]] as Pt[], gem: [[468,212],[556,212],[512,258]] as Pt[] };
      const triBot = { outer: [[452,652],[572,652],[512,575]] as Pt[], inner: [[474,640],[550,640],[512,600]] as Pt[], gem: [[486,636],[538,636],[512,608]] as Pt[] };

      const metal = new THREE.MeshPhysicalMaterial({ color: 0x8a8c95, metalness: 0.9, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6 });
      const glowA = new THREE.MeshBasicMaterial({ color: 0xff1a0d, toneMapped: false });
      const glowB = new THREE.MeshBasicMaterial({ color: 0xff2a1f, toneMapped: false });
      const gemTop = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff1a0d, emissiveIntensity: 1.4, toneMapped: false });
      const gemBot = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff5a3d, emissiveIntensity: 1.4, toneMapped: false });

      const extrude = (shape: InstanceType<typeof THREE.Shape>, depth: number, bevel = 0.06) =>
        new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 4, curveSegments: 1 });

      const logo = new THREE.Group();
      blades.forEach((b) => {
        const m = new THREE.Mesh(extrude(P(b.pts), 0.55), metal);
        m.position.z = b.z;
        logo.add(m);
        const rim = new THREE.Mesh(new THREE.ShapeGeometry(P(grow(b.pts, 1.045))), b.a ? glowA : glowB);
        rim.position.z = b.z - 0.05;
        logo.add(rim);
        const [cx, cy] = centroid(b.pts);
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.02), b.a ? glowA : glowB);
        slit.position.set((cx - CX) * S, -(cy - CY) * S, b.z + 0.68);
        slit.rotation.z = b.a ? 0.45 : -0.55;
        logo.add(slit);
      });
      const frame = (t: typeof triTop, mat: InstanceType<typeof THREE.MeshStandardMaterial>) => {
        const s = P(t.outer);
        s.holes.push(new THREE.Path(P(t.inner).getPoints().reverse()));
        const f = new THREE.Mesh(extrude(s, 0.4, 0.04), metal);
        f.position.z = 0.05;
        logo.add(f);
        const g = new THREE.Mesh(extrude(P(t.gem), 0.25, 0.03), mat);
        g.position.z = 0.25;
        logo.add(g);
        const r = new THREE.Mesh(new THREE.ShapeGeometry(P(grow(t.outer, 1.06))), mat);
        r.position.z = 0;
        logo.add(r);
      };
      frame(triTop, gemTop);
      frame(triBot, gemBot);

      new THREE.Box3().setFromObject(logo).getCenter(logo.position).multiplyScalar(-1);
      const pivot = new THREE.Group();
      pivot.add(logo);
      scene.add(pivot);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(4, 6, 8);
      scene.add(key);
      const l1 = new THREE.PointLight(0xff1a0d, 60, 30);
      l1.position.set(-6, 2, 3);
      scene.add(l1);
      const l2 = new THREE.PointLight(0xff2a1f, 60, 30);
      l2.position.set(6, -3, 3);
      scene.add(l2);
      /* moving specular sweep: a bright highlight glides across the metal so it reads as polished */
      const sweep = new THREE.PointLight(0xffffff, 90, 22);
      scene.add(sweep);


      /* interaction */
      let drag = false, lx = 0, ly = 0, rx = 0, ry = 0, vy = 0, tx = 0, ty = 0;
      const cv = renderer.domElement;
      cv.style.touchAction = "pan-y";
      const down = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); e.stopPropagation(); };
      const up = () => (drag = false);
      const move = (e: PointerEvent) => {
        tx = (e.clientY / window.innerHeight - 0.5) * 0.4;
        ty = (e.clientX / window.innerWidth - 0.5) * 0.6;
        if (!drag) return;
        vy = (e.clientX - lx) * 0.01;
        ry += vy;
        rx += (e.clientY - ly) * 0.008;
        lx = e.clientX;
        ly = e.clientY;
      };
      const stopClick = (e: MouseEvent) => e.stopPropagation();
      cv.addEventListener("pointerdown", down);
      cv.addEventListener("click", stopClick);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointermove", move);

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

      const clock = new THREE.Clock();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        const sc = scrollSpin ? window.scrollY * 0.0025 : 0;
        if (!drag) { vy *= 0.92; ry += vy; ry *= 0.97; rx *= 0.96; }
        const sway = Math.sin(t * 0.7) * 0.35;
        pivot.rotation.y += (ry + ty + sway + sc - pivot.rotation.y) * 0.08;
        pivot.rotation.x += (rx + tx - pivot.rotation.x) * 0.08;
        pivot.position.y = Math.sin(t * 1.2) * 0.12;
        sweep.position.set(Math.sin(t * 0.9) * 7, Math.cos(t * 0.6) * 3, 6);
        const pulse = 1.4 + Math.sin(t * 3) * 0.4;
        gemTop.emissiveIntensity = pulse;
        gemBot.emissiveIntensity = 2.8 - pulse;
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        cv.removeEventListener("pointerdown", down);
        cv.removeEventListener("click", stopClick);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointermove", move);
        scene.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>;
          if (m.geometry) m.geometry.dispose();
        });
        [metal, glowA, glowB, gemTop, gemBot].forEach((m) => m.dispose());
        pmrem.dispose();
        renderer.dispose();
        cv.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [scrollSpin]);

  return <div ref={host} className={className} data-cursor aria-label="Virtux 3D logo" role="img" />;
};
