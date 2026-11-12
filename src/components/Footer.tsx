"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SplitReveal } from "@/components/TextFX";

const links = [
  { href: "/", label: "Arena Home" },
  { href: "/about", label: "About Our Facility" },
  { href: "/pricing", label: "Rates & Memberships" },
  { href: "/cafe", label: "Gamer Café & Bites" },
  { href: "/gallery", label: "Arena Gallery" },
  { href: "/contact", label: "Location & Hours" },
  { href: "/feedback", label: "Gamer Reviews" },
];

const amenities = [
  "100% Air-Conditioned Arena (21°C)",
  "Dual UPS & Silent Generator Backup",
  "Gigabit Optical Fiber LAN",
  "Sanitized Hardware Between Sessions",
];

/* ───────── drifting smoke (raw WebGL, rendered at low res, paused offscreen) ───────── */

const SMOKE_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r; uniform float t; uniform vec2 m; uniform float mi;
float h(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.03;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r.y;
  vec2 mm=m*vec2(r.x/r.y,1.);
  float md=exp(-2.5*length(uv-mm))*mi;
  vec2 q=vec2(fbm(uv*1.2+vec2(0.,t*.04)),fbm(uv*1.2+vec2(5.2,1.3)-t*.03));
  vec2 w=vec2(fbm(uv*1.3+3.*q+vec2(1.7,9.2)+t*.05),fbm(uv*1.3+3.*q+vec2(8.3,2.8)-t*.04));
  float f=fbm(uv*1.1+2.6*w+md*1.2);
  float s=smoothstep(.4,.95,f);
  vec3 col=mix(vec3(.008,.004,.004),vec3(.2,.035,.03),s);
  col+=vec3(.55,.02,.0)*pow(s,2.5)*.35;
  col+=vec3(.6,.02,.0)*md*s*.4;
  vec2 c=gl_FragCoord.xy/r-.5;
  col*=1.-dot(c,c)*1.5;
  gl_FragColor=vec4(col,1.);
}`;

const Smoke: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return; // CSS gradient fallback stays visible
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, SMOKE_FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r"), uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m"), uMi = gl.getUniformLocation(prog, "mi");

    const SCALE = 0.35; // smoke is soft: low res is invisible and cheap on phones
    const size = () => {
      cv.width = Math.max(2, Math.round(cv.clientWidth * SCALE));
      cv.height = Math.max(2, Math.round(cv.clientHeight * SCALE));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5, mi = 0, tmi = 0;
    const host = cv.parentElement!;
    const move = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      tmx = (e.clientX - b.left) / b.width;
      tmy = 1 - (e.clientY - b.top) / b.height;
      tmi = 1;
    };
    const leave = () => (tmi = 0);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0, last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return; // ~30fps is plenty for smoke
      last = now;
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06; mi += (tmi - mi) * 0.04;
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, reduce ? 4 : (now - t0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.uniform1f(uMi, mi);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 w-full h-full blur-[6px] scale-105" />;
};

/* ───────── wordmark drawn as horizontal scan-lines that glitch under the cursor ───────── */

const LineMark: React.FC<{ text: string; sound: boolean }> = ({ text, sound }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    type Seg = { x0: number; x1: number; y: number; row: number };
    let segs: Seg[] = [];
    let W = 0, H = 0, gap = 10, rows = 1, dpr = 1;
    let mx = -9999, my = -9999, hover = 0, inside = false;
    let revealAt = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const probe = document.createElement("span");
    probe.className = "font-display";
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily || "Impact, sans-serif";
    probe.remove();

    const build = () => {
      W = cv.parentElement!.clientWidth;
      if (!W) return;
      gap = W < 480 ? 5 : W < 768 ? 7 : W < 1200 ? 10 : 13;
      H = Math.round(W * 0.3);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.height = `${H}px`;

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      let size = 100;
      o.font = `${size}px ${family}`;
      const m0 = o.measureText(text);
      size *= (W * 0.985) / m0.width;
      o.font = `${size}px ${family}`;
      let m = o.measureText(text);
      const capH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      if (capH > H * 0.94) {
        size *= (H * 0.94) / capH;
        o.font = `${size}px ${family}`;
        m = o.measureText(text);
      }
      const asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
      o.fillStyle = "#fff";
      o.fillText(text, (W - m.width) / 2, (H - (asc + desc)) / 2 + asc);
      const data = o.getImageData(0, 0, W, H).data;

      segs = [];
      let row = 0;
      for (let y = Math.floor(gap / 2); y < H; y += gap, row++) {
        let run = -1;
        for (let x = 0; x <= W; x++) {
          const on = x < W && data[(y * W + x) * 4 + 3] > 120;
          if (on && run < 0) run = x;
          else if (!on && run >= 0) {
            if (x - run > 1) segs.push({ x0: run, x1: x, y, row });
            run = -1;
          }
        }
      }
      rows = Math.max(1, row);
    };

    let ac: AudioContext | null = null;
    let lastRow = -1, lastBlip = 0;
    const blip = (row: number) => {
      const now = performance.now();
      if (!soundRef.current || row === lastRow || now - lastBlip < 45) return;
      lastRow = row;
      lastBlip = now;
      try {
        ac ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ac.createOscillator(), g = ac.createGain();
        osc.type = "triangle";
        osc.frequency.value = 180 + (rows - row) * 14;
        g.gain.setValueAtTime(0.04, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.09);
        osc.connect(g).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.1);
      } catch {
        /* audio blocked: stay silent */
      }
    };

    const host = cv.parentElement!;
    const move = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      mx = e.clientX - b.left;
      my = e.clientY - b.top;
      inside = my >= 0 && my <= b.height;
      if (inside) blip(Math.round((my - gap / 2) / gap));
    };
    const leave = () => {
      inside = false;
      lastRow = -1;
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerdown", move);
    host.addEventListener("pointerleave", leave);

    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);
    document.fonts?.ready.then(build);

    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !revealAt) revealAt = performance.now();
      },
      { threshold: 0.15 }
    );
    io.observe(cv);

    const ease = (k: number) => 1 - Math.pow(1 - k, 3);
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || !W) return;
      const t = now / 1000;
      hover += ((inside ? 1 : 0) - hover) * 0.08;
      const rv = reduce ? 1 : Math.min(1, (now - revealAt) / 1600);
      const sy = gap * 4, sx = Math.max(110, W * 0.18);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = W < 768 ? 1 : 1.25;
      ctx.lineCap = "butt";

      for (const s of segs) {
        const rowK = ease(Math.min(1, Math.max(0, rv * 1.7 - (s.row / rows) * 0.7)));
        if (rowK <= 0) continue;
        const cx = (s.x0 + s.x1) / 2, dy = s.y - my, dx = cx - mx;
        const k = reduce ? 0 : hover * Math.exp(-(dy * dy) / (2 * sy * sy)) * Math.exp(-(dx * dx) / (2 * sx * sx));
        // glitch: each row slides a different way and stretches near the cursor
        const dir = Math.sin(s.row * 2.17 + Math.floor(t * 9) * 0.6);
        const shift = k * gap * 7 * dir;
        const stretch = k * gap * 3;
        const idle = reduce ? 0 : Math.sin(t * 1.4 + s.row * 0.45) * gap * 0.18;
        const x0 = s.x0 + shift - stretch + idle;
        const x1 = x0 + (s.x1 - s.x0 + stretch * 2) * rowK;
        const a = 0.42 + k * 0.5;
        ctx.strokeStyle = k > 0.18 ? `rgba(225,${Math.round(40 * (1 - k))},${Math.round(20 * (1 - k))},${a})` : `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.moveTo(x0, s.y + 0.5);
        ctx.lineTo(x1, s.y + 0.5);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", move);
      host.removeEventListener("pointerleave", leave);
      ac?.close();
    };
  }, [text]);

  return <canvas ref={ref} role="img" aria-label={text} className="block w-full touch-pan-y" />;
};

/* ───────── live local time ───────── */

const ArenaClock: React.FC = () => {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      IST <span className="text-[#e10600]">→</span> {now ?? "--:--"}
    </span>
  );
};

/* ───────── footer ───────── */

export const Footer: React.FC = () => {
  const [sound, setSound] = useState(false);

  return (
    <footer className="relative z-10 isolate overflow-hidden text-white bg-[#050505] border-t border-white/[0.06]">
      {/* smoke backdrop (with a static gradient beneath in case WebGL is unavailable) */}
      <div className="absolute inset-0 -z-10 pointer-events-auto">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_40%,rgba(70,8,4,0.35),transparent_70%),radial-gradient(50%_40%_at_75%_70%,rgba(120,10,0,0.18),transparent_70%)]" />
        <Smoke />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/60 pointer-events-none" />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-10">
        {/* top line */}
        <div className="flex items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/70">
          <span>
            Play <span className="text-white/30">+</span> Eat <span className="text-white/30">+</span> Chill{" "}
            <span className="text-white/30">+</span> Repeat
          </span>
          <span className="text-white/45">
            <ArenaClock />
          </span>
        </div>

        {/* headline + CTA */}
        <div className="mt-8 sm:mt-12 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <SplitReveal
              as="h2"
              text="Designed for champions."
              className="font-sans font-medium text-[clamp(2.4rem,7.4vw,7rem)] leading-[0.95] tracking-[-0.045em] text-white/90"
            />
            <div className="flex flex-wrap items-baseline gap-x-[0.25em] font-sans font-medium text-[clamp(2.4rem,7.4vw,7rem)] leading-[0.95] tracking-[-0.045em] text-white/90">
              <SplitReveal as="span" text="Built for true" delay={180} />
              <span className="font-script text-[#e10600] tracking-normal text-[1.15em] leading-none">gamers.</span>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-5 lg:items-end lg:pb-4">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-between gap-10 w-full sm:w-auto min-w-[260px] border-b border-white/60 hover:border-[#e10600] pb-3 font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-white/85 hover:text-white transition-colors"
            >
              Location &amp; Hours
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 text-[#e10600]">→</span>
            </Link>
            <div className="w-full sm:w-auto min-w-[260px] flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              <span>Open 7 Days a Week</span>
              <span className="text-white/80">10:00 AM – 9:30 PM</span>
            </div>
          </div>
        </div>

        {/* info grid */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 text-sm">
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-5 justify-between">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-3 group w-max">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon-3d.png" alt="Virtux" className="w-10 h-10 object-contain mix-blend-screen scale-125 transition-transform duration-700 group-hover:[transform:perspective(400px)_rotateY(360deg)_scale(1.25)]" />
                <div>
                  <span className="font-display text-xl tracking-wide">VIRTUX</span>
                  <span className="block font-mono text-[10px] tracking-[0.3em] text-[#e10600] uppercase">Gaming Hub · Ranaghat</span>
                </div>
              </Link>
              <p className="text-white/50 leading-relaxed max-w-sm">
                Ranaghat&apos;s premier console arena, PC battle station, sim racing &amp; gourmet café sanctuary. Designed for champions and built for true gamers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              aria-pressed={sound}
              className="hidden sm:inline-flex items-center gap-3 w-max font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white"
            >
              Sound {sound ? "on" : "off"}
              <span className="flex items-end gap-[2px] h-3" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-[2px] bg-[#e10600] ${sound ? "animate-[vxbar_0.9s_ease-in-out_infinite]" : ""}`}
                    style={{ height: sound ? undefined : 3, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
              <span className="text-white/40">Hover the lines.</span>
            </button>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Quick Navigation</h4>
            <ul className="space-y-1.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{l.label}</span>
                    <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e10600]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Arena Operations</h4>
            <ul className="space-y-1.5 text-white/60">
              {amenities.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-[#e10600]">+</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Contact &amp; Hub Address</h4>
            <div className="space-y-1.5">
              <a href="tel:+919147718768" className="flex gap-3 text-white/85 hover:text-[#e10600] transition-colors">
                <span className="text-white/35 w-4">P.</span>+91 91477 18768
              </a>
              <a href="tel:+916294713465" className="flex gap-3 text-white/85 hover:text-[#e10600] transition-colors">
                <span className="text-white/35 w-4">P.</span>+91 62947 13465
              </a>
              <a href="mailto:consumersupport.virtuxgaminghub@gmail.com" className="flex gap-3 text-white/85 hover:text-[#e10600] transition-colors break-all">
                <span className="text-white/35 w-4 shrink-0">E.</span>consumersupport.virtuxgaminghub@gmail.com
              </a>
              <p className="flex gap-3 text-white/55 leading-relaxed pt-2">
                <span className="text-white/35 w-4 shrink-0">A.</span>
                <span>
                  <strong className="text-white/85 font-medium">Virtux Arena Ranaghat:</strong> Srimanta Kundu Lane, Nearby Brojoballav Mandir, Ghotokpara, Ranaghat, Nadia, West Bengal, Pin - 741201
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ethical statement */}
        <p className="mt-14 max-w-4xl text-xs text-white/45 leading-relaxed border-l border-[#e10600] pl-4">
          <span className="text-[#e10600] font-mono uppercase tracking-widest mr-2">Ethical Gaming Statement:</span>
          Virtux Gaming Hub does not promote, support or encourage gambling or any activity involving betting your hard-earned money. We serve exclusively as a high-end console and PC hardware rental destination for passionate esports and casual entertainment at fair, transparent pricing.
        </p>
      </div>

      {/* scan-line wordmark */}
      <div className="px-3 sm:px-6 lg:px-8 select-none">
        <LineMark text="VIRTUX" sound={sound} />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-4 pb-24 lg:pb-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        <p>© {new Date().getFullYear()} Virtux Gaming Hub. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hover:text-[#e10600]">Pricing Policy</Link>
          <span>+</span>
          <Link href="/about" className="hover:text-[#e10600]">Terms of Arena</Link>
          <span>+</span>
          <Link href="/contact" className="hover:text-[#e10600]">Directions</Link>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};
