"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { GAMES_DATA } from "@/data/gamesData";
import { Operator3D } from "@/components/Operator3D";
import { BootLoader, Magnetic } from "@/components/FX";

/* ───────────────────────── content (unchanged copy, moved into arrays) ───────────────────────── */
const ZONES = [
  {
    icon: "🎮",
    title: "Console Arena (PS5)",
    meta: "Starting at ₹80 / 30 mins · 4K 120Hz Displays",
    body: "Dedicated PlayStation 5 stations with ultra-low input lag HDR gaming displays, sanitized DualSense haptic controllers, and a complete library of 100+ titles including EA FC 25, Tekken 8, and Spider-Man 2.",
    cta: "Book PS5 Pod",
    preset: "PlayStation 5 (Console + Controller)",
    note: "6 Pods Online",
  },
  {
    icon: "💻",
    title: "RTX Battle Stations",
    meta: "Starting at ₹65 / 30 mins · 240Hz to 360Hz Monitors",
    body: "Liquid-cooled gaming PCs powered by NVIDIA GeForce RTX 3060, 4070, and flagship 4090 GPUs. Mechanical keyboards, studio headsets, and zero-jitter optical fiber LAN tuned for Valorant and CS2.",
    cta: "Book PC Rig",
    preset: "Gaming PC Battle Station (RTX Rigs)",
    note: "Sub-10ms Ping",
  },
  {
    icon: "🏎️",
    title: "Motion Sim Cockpit",
    meta: "Starting at ₹70 / 30 mins · Logitech G29 Force Feedback",
    body: "Experience authentic racing physics with dual-motor force feedback, responsive load-cell pedals, and full bucket seating. Master Gran Turismo 7, F1 23, and Forza Horizon 5.",
    cta: "Book Cockpit",
    preset: "Racing Simulator (Logitech G29)",
    note: "GT7 & F1 Ready",
  },
  {
    icon: "🎬",
    title: "Private Dolby Cinema",
    meta: "Starting at ₹40 / 1 hr (Up to 3 guests included)",
    body: "Giant 150-inch 4K laser projection with 7.2 Dolby Atmos surround audio. Perfect for private OTT watch parties (Netflix, Prime, Hotstar), anime marathons, and live tournament screenings.",
    cta: "Book Cinema Suite",
    preset: "Dolby Cinema & OTT Suite",
    note: "Squad Suite",
  },
  {
    icon: "☕",
    title: "Virtux Café & Bites",
    meta: "Artisan Coffee, Monster Cans & Hot Bites",
    body: "Fuel up without leaving your station. Enjoy fresh espresso, chilled blue mocktails, loaded peri-peri fries, crispy chicken burgers, and molten lava cakes delivered directly to your desk.",
    cta: "Order Food Online",
    href: "/cafe",
    note: "In-Seat Delivery",
  },
  {
    icon: "🏆",
    title: "Esports & Cash Cups",
    meta: "Weekly Tournaments · Real Cash Prizes",
    body: "Join Ranaghat's most competitive esports brackets. Weekly FIFA / EA FC cups, Tekken 8 showdowns, and Valorant LAN battles with official live standings and championship trophies.",
    cta: "Register for Next Cup",
    href: "/contact",
    note: "Open to All",
  },
];

const SLIDES = ["4K 120Hz PS5 Arena", "360Hz RTX Battle Rig", "Motion Sim Cockpit"];
const SLIDE_PRESETS = [
  "PlayStation 5 (Console + Controller)",
  "Gaming PC Battle Station (RTX Rigs)",
  "Racing Simulator (Logitech G29)",
];

const STORY =
  "Carve your own clever path to victory in Ranaghat's all-in-one entertainment sanctuary. Featuring liquid-cooled RTX battle stations, PlayStation 5 consoles, force-feedback simulators, and private Dolby Cinema screening.";

/* ───────────────────────── helpers ───────────────────────── */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height + window.innerHeight;
        setP(Math.min(1, Math.max(0, (window.innerHeight - r.top) / total)));
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, p] as const;
}

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* Ambient arena hum (WebAudio, no files) */
function useAmbient() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [on, setOn] = useState(false);
  const toggle = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 420;
      [55, 82.4, 110.3].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 1 ? "triangle" : "sawtooth";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.35 : 0.12;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08 + i * 0.05;
        const lg = ctx.createGain();
        lg.gain.value = 1.5;
        lfo.connect(lg).connect(o.frequency);
        o.connect(g).connect(lp);
        o.start();
        lfo.start();
      });
      lp.connect(gain).connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = gain;
    }
    const ctx = ctxRef.current!;
    const g = gainRef.current!;
    const next = !on;
    if (next) ctx.resume();
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.linearRampToValueAtTime(next ? 0.08 : 0, ctx.currentTime + 0.8);
    setOn(next);
  };
  useEffect(() => () => void ctxRef.current?.close(), []);
  return { on, toggle };
}

const SoundBars: React.FC<{ on: boolean }> = ({ on }) => (
  <span className="flex items-end gap-[3px] h-6">
    {Array.from({ length: 14 }).map((_, i) => (
      <span
        key={i}
        className="w-[2px] bg-[#e10600] origin-bottom"
        style={{
          height: `${30 + ((i * 37) % 70)}%`,
          animation: on ? `bar 0.${6 + (i % 4)}s ease-in-out ${i * 45}ms infinite alternate` : "none",
          opacity: on ? 1 : 0.45,
          transform: on ? undefined : "scaleY(0.35)",
        }}
      />
    ))}
    <style jsx>{`
      @keyframes bar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
    `}</style>
  </span>
);

/* Flames divider */
const Flames: React.FC<{ flip?: boolean; className?: string }> = ({ flip, className = "" }) => (
  <div className={`relative h-28 sm:h-40 overflow-hidden pointer-events-none ${flip ? "rotate-180" : ""} ${className}`} aria-hidden>
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute bottom-0 w-[110%] -left-[5%] h-full animate-flicker origin-bottom">
      <path
        fill="#8f0000"
        d="M0 200 L0 120 C40 140 60 60 90 110 C110 40 140 140 170 90 C200 20 220 120 250 70 C280 130 300 30 340 100 C360 60 390 150 420 80 C450 10 470 130 510 90 C540 40 560 140 600 70 C630 120 650 20 690 100 C720 50 740 140 780 80 C810 20 830 130 870 90 C900 40 920 150 960 70 C990 120 1010 30 1050 100 C1080 50 1100 140 1140 80 C1170 20 1190 130 1230 90 C1260 40 1280 150 1320 70 C1350 120 1380 40 1440 110 L1440 200 Z"
      />
    </svg>
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute bottom-0 w-[110%] -left-[2%] h-[75%] origin-bottom" style={{ animation: "flicker 1.1s ease-in-out infinite reverse" }}>
      <path
        fill="#c40500"
        d="M0 200 L0 140 C50 160 70 90 110 130 C140 70 160 160 200 110 C230 60 260 150 300 100 C330 150 360 70 400 120 C430 80 460 160 500 110 C530 60 560 150 600 100 C640 150 660 70 700 120 C740 80 760 160 800 110 C840 60 860 150 900 100 C940 150 960 70 1000 120 C1040 80 1060 160 1100 110 C1140 60 1160 150 1200 100 C1240 150 1260 70 1300 120 C1340 80 1380 150 1440 120 L1440 200 Z"
      />
    </svg>
    <div className="absolute bottom-0 inset-x-0 h-8 bg-[#8f0000]" />
  </div>
);

/* Tilt card */
const Tilt: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`[transform-style:preserve-3d] transition-transform duration-300 ease-out ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(0)`;
        el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
      }}
    >
      {children}
    </div>
  );
};

/* ───────────────────────── PAGE ───────────────────────── */
export default function HomePage() {
  const { stations, setIsBookingOpen, setBookingServicePreset, reviews } = useStore();
  const [gameFilter, setGameFilter] = useState<"all" | "ps5" | "pc" | "sim">("all");
  const [activeSlide, setActiveSlide] = useState(1);
  const [booted, setBooted] = useState(true);
  const [activeZone, setActiveZone] = useState<number>(0);
  const [preview, setPreview] = useState({ x: 0, y: 0, show: false });
  const ambient = useAmbient();

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("vx-booted")) setBooted(false);
    } catch {
      /* storage blocked: skip loader */
    }
  }, []);
  const finishBoot = () => {
    setBooted(true);
    try {
      sessionStorage.setItem("vx-booted", "1");
    } catch {}
  };

  // auto-rotate hero slide
  useEffect(() => {
    const id = window.setInterval(() => setActiveSlide((s) => (s < 3 ? s + 1 : 1)), 4200);
    return () => window.clearInterval(id);
  }, []);

  const availableStationsCount = stations.filter((s) => s.status === "Available").length;

  const filteredGames = GAMES_DATA.filter((g) => {
    if (gameFilter === "all") return true;
    return g.category === gameFilter || g.category === "all";
  });

  const handleQuickBook = (preset: string) => {
    setBookingServicePreset(preset);
    setIsBookingOpen(true);
  };

  // manifesto scatter
  const [manRef, manP] = useScrollProgress<HTMLElement>();
  const words = useMemo(() => STORY.split(" "), []);
  const scatter = useMemo(
    () => words.map((_, i) => ({ x: ((i * 7919) % 600) - 300, y: ((i * 104729) % 400) - 200, r: ((i * 31) % 60) - 30 })),
    [words]
  );
  const assemble = Math.min(1, Math.max(0, (manP - 0.15) / 0.4));

  // hero parallax
  const [heroRef, heroP] = useScrollProgress<HTMLElement>();

  // stats
  const [statsRef, statsSeen] = useInView<HTMLDivElement>(0.25);
  const s1 = useCountUp(ZONES.length, statsSeen);
  const s2 = useCountUp(100, statsSeen);
  const s3 = useCountUp(stations.length, statsSeen);
  const s4 = useCountUp(65, statsSeen);

  return (
    <div className="relative bg-[#050505] text-white -mt-16">
      {!booted && <BootLoader onEnter={finishBoot} />}

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[640px] overflow-hidden"
        data-no-reveal
      >
        {/* blood gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_75%_0%,#e10600_0%,#8f0000_35%,#2a0000_65%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#050505_100%)]" />
        <div className="absolute inset-0 light-dot-grid opacity-40" />

        {/* giant word behind */}
        <div
          className="absolute inset-x-0 top-[34%] sm:top-[30%] flex justify-center pointer-events-none"
          style={{ transform: `translateY(${heroP * -120}px)` }}
        >
          <span className="font-display text-[34vw] sm:text-[26vw] leading-none text-white/95 tracking-tight">VIRTUX</span>
        </div>

        {/* character */}
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[110vw] sm:w-[80vw] md:w-[62vw] lg:w-[46vw] max-w-[680px] h-[74svh] sm:h-[80svh] z-10"
          style={{ transform: `translate(-50%, ${heroP * 80}px)` }}
        >
          <Operator3D className="w-full h-full" />
        </div>

        {/* outline word in front for depth */}
        <div
          className="absolute inset-x-0 top-[34%] sm:top-[30%] flex justify-center pointer-events-none z-20 mix-blend-overlay"
          style={{ transform: `translateY(${heroP * -120}px)` }}
          aria-hidden
        >
          <span className="font-display text-[34vw] sm:text-[26vw] leading-none text-outline tracking-tight opacity-60">VIRTUX</span>
        </div>

        {/* top meta row */}
        <div className="absolute top-20 sm:top-24 inset-x-0 z-30 px-5 sm:px-8 max-w-[1440px] mx-auto flex justify-between items-start">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/85">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Ranaghat&apos;s First Premium Gaming Hub
          </div>
          <div className="hidden sm:block text-right font-mono text-[11px] tracking-[0.25em] uppercase text-white/70">
            Open Daily<br />10 AM – 9:30 PM
          </div>
        </div>

        {/* left copy */}
        <div className="absolute z-30 left-5 sm:left-8 bottom-[30%] sm:bottom-[22%] max-w-[260px] sm:max-w-xs hidden md:block">
          <p className="text-sm leading-relaxed text-white/85">{STORY}</p>
        </div>

        {/* right roles */}
        <div className="absolute z-30 right-5 sm:right-8 bottom-[30%] sm:bottom-[24%] text-right hidden md:block">
          {["PS5 Console Arena", "RTX Battle Stations", "Motion Simulators", "Dolby Cinema"].map((r, i) => (
            <p
              key={r}
              className="font-orbitron text-lg lg:text-2xl uppercase leading-tight text-white glitch"
              style={{ animation: `heroIn 1s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.12}s both` }}
            >
              {r}
            </p>
          ))}
          <p className="mt-3 font-display text-4xl lg:text-5xl text-white">
            ₹139/-<span className="block font-mono text-[10px] tracking-[0.25em] text-white/60">PS5 · PC · SIMULATOR — from ₹65 / 30m</span>
          </p>
        </div>

        {/* mobile headline */}
        <div className="md:hidden absolute z-30 inset-x-5 top-32 text-center">
          <p className="font-orbitron text-sm tracking-[0.4em] text-white/90">PLAY · EAT · CHILL</p>
        </div>

        {/* bottom-left: sound + slide rail */}
        <div className="absolute z-30 left-5 sm:left-8 bottom-16 sm:bottom-20 flex items-center gap-5">
          <button
            onClick={ambient.toggle}
            className="flex items-center gap-3 group"
            aria-label={ambient.on ? "Mute arena ambience" : "Play arena ambience"}
          >
            <SoundBars on={ambient.on} />
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 group-hover:text-white">
              Sound {ambient.on ? "on" : "off"}
            </span>
          </button>
        </div>

        {/* bottom-right: live booking card (like "Let's connect") */}
        <button
          onClick={() => handleQuickBook(SLIDE_PRESETS[activeSlide - 1])}
          className="absolute z-30 right-4 sm:right-8 bottom-14 sm:bottom-20 group flex items-stretch bg-black/60 backdrop-blur-md border border-white/15 hover:border-[#e10600] transition-colors text-left"
        >
          <div className="w-16 sm:w-24 relative overflow-hidden bg-[#8f0000]">
            <div key={activeSlide} className="absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl" style={{ animation: "heroIn .6s both" }}>
              {["🎮", "💻", "🏎️"][activeSlide - 1]}
            </div>
            <div className="absolute inset-x-0 h-4 bg-white/20 animate-scan" />
          </div>
          <div className="px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/70">
              Live <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse" />
              <span className="text-emerald-400">{availableStationsCount}/{stations.length} free</span>
            </div>
            <p className="font-orbitron text-base sm:text-xl text-white leading-tight">{SLIDES[activeSlide - 1]}</p>
            <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/50 group-hover:text-[#e10600] transition-colors">
              Tap to quick reserve →
            </p>
          </div>
          <div className="hidden sm:flex flex-col justify-center border-l border-white/10 px-2 font-mono text-[10px] text-white/50">
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlide((s) => (s > 1 ? s - 1 : 3));
              }}
              className="hover:text-white px-1"
            >
              ▲
            </span>
            <span className="text-white py-1">0{activeSlide}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlide((s) => (s < 3 ? s + 1 : 1));
              }}
              className="hover:text-white px-1"
            >
              ▼
            </span>
          </div>
        </button>

        {/* bottom HUD strip */}
        <div className="absolute z-30 bottom-0 inset-x-0 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-11 flex items-center justify-between font-orbitron text-[11px] sm:text-sm tracking-[0.2em] uppercase">
            {["+", "Play", "+", "Eat", "+", "Chill", "+"].map((w, i) =>
              w === "+" ? (
                <span key={i} className="text-white/50 text-lg transition-transform duration-500 hover:rotate-90">+</span>
              ) : (
                <button
                  key={i}
                  onClick={() => (w === "Eat" ? (window.location.href = "/cafe") : w === "Play" ? handleQuickBook(SLIDE_PRESETS[0]) : document.getElementById("zones")?.scrollIntoView({ behavior: "smooth" }))}
                  className="text-white hover:text-[#e10600] transition-colors glitch"
                >
                  {w}
                </button>
              )
            )}
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-14 hidden lg:flex flex-col items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-white/50">
          Scroll
          <span className="w-px h-8 bg-white/30 relative overflow-hidden">
            <span className="absolute inset-x-0 h-3 bg-white animate-scan" />
          </span>
        </div>

        <style jsx global>{`
          @keyframes heroIn {
            from { opacity: 0; transform: translateY(24px); filter: blur(6px); }
            to { opacity: 1; transform: none; filter: none; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════ MARQUEE BAND ═══════════════════════════ */}
      <div className="relative bg-[#e10600] text-black py-3 sm:py-4 overflow-hidden -rotate-1 scale-[1.02] border-y border-black z-20" aria-hidden>
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center">
              {["Ranaghat's First Premium Gaming Hub", "PS5 4K 120Hz", "RTX Battle Rigs", "Motion Simulators", "Dolby Cinema", "Gamer Café", "Weekly Cash Cups"].map((t) => (
                <span key={t + k} className="flex items-center font-display text-2xl sm:text-4xl uppercase px-6">
                  {t}
                  <span className="ml-12 text-xl">✕</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════ MANIFESTO (scroll-assembling words) ═══════════════════════════ */}
      <section ref={manRef} className="relative min-h-[120vh] sm:min-h-[150vh]" data-no-reveal>
        <div className="sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden px-5 sm:px-8">
          <div className="max-w-[1440px] mx-auto w-full">
            <p className="font-gothic text-[#e10600] text-5xl sm:text-7xl lg:text-8xl leading-none" style={{ opacity: 0.2 + assemble * 0.8 }}>
              this will
            </p>
            <h2 className="font-display text-[16vw] sm:text-[12vw] leading-[0.85] uppercase text-white">
              <span className="block" style={{ transform: `translateX(${(1 - assemble) * -12}vw)` }}>Feel</span>
              <span className="block text-[#e10600]" style={{ transform: `translateX(${(1 - assemble) * 12}vw)` }}>Different</span>
            </h2>
            <p className="mt-8 sm:mt-12 max-w-4xl ml-auto font-orbitron uppercase text-lg sm:text-2xl lg:text-3xl leading-snug">
              {words.map((w, i) => {
                const k = Math.min(1, Math.max(0, assemble * 1.4 - (i / words.length) * 0.4));
                const s = scatter[i];
                return (
                  <span
                    key={i}
                    className="inline-block mr-[0.3em] will-change-transform"
                    style={{
                      transform: `translate(${s.x * (1 - k)}px, ${s.y * (1 - k)}px) rotate(${s.r * (1 - k)}deg)`,
                      opacity: 0.15 + k * 0.85,
                      color: k > 0.98 ? "#fff" : "#e10600",
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATS on RED ═══════════════════════════ */}
      <Flames />
      <section className="relative bg-[#8f0000] text-black overflow-hidden" data-no-reveal>
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_50%_40%,#ff2a1f,transparent_60%)]" />
        {/* emblem */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 select-none">
          <span className="font-gothic text-[60vw] sm:text-[40vw] leading-none text-[#ff2a1f]">V</span>
        </div>
        <div ref={statsRef} className="relative max-w-[1440px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          {[
            { v: s1, suffix: "", label: "Experience zones", line: "Each one different. Each one demanding something sharper." },
            { v: s2, suffix: "+", label: "Titles installed", line: "EA FC 25, Tekken 8, Spider-Man 2, GT7 and more — ready to launch." },
            { v: s3, suffix: "", label: "Live stations", line: `${availableStationsCount} free right now. Walk in or reserve ahead.` },
            { v: s4, suffix: "₹", label: "Starting / 30 min", line: "Zero hidden charges. Transparent hourly rates." },
          ].map((s, i) => (
            <div
              key={s.label}
              className="group grid grid-cols-12 items-center gap-4 py-6 sm:py-8 border-b border-black/25 last:border-0 cursor-default"
            >
              <span className="col-span-2 sm:col-span-1 font-mono text-xs text-black/50">0{i + 1}</span>
              <span className="col-span-10 sm:col-span-5 font-gothic text-7xl sm:text-8xl lg:text-9xl leading-none text-black transition-transform duration-500 group-hover:translate-x-4 group-hover:text-white">
                {s.suffix === "₹" ? `₹${s.v}` : `${s.v}${s.suffix}`}
              </span>
              <div className="col-span-12 sm:col-span-6 sm:text-right">
                <p className="font-display text-2xl sm:text-4xl uppercase text-black">{s.label}</p>
                <p className="font-orbitron text-sm sm:text-base uppercase text-black/85 font-medium mt-1 max-w-md sm:ml-auto">{s.line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Flames flip />

      {/* ═══════════════════════════ LIVE ARENA OCCUPANCY ═══════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Real-Time Station Telemetry</span>
              <h2 className="font-display text-5xl sm:text-7xl uppercase leading-none mt-3">
                Live Arena <span className="text-outline-red">Occupancy</span>
              </h2>
            </div>
            <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400" />Available</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-400" />Reserved</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-[#e10600]" />In-use</span>
              <Link href="/pricing" className="hidden lg:inline text-white hover:text-[#e10600]">Full rates →</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/10 border border-white/10">
            {stations.map((st) => {
              const c = st.status === "Available" ? "#34d399" : st.status === "Reserved" ? "#fbbf24" : "#e10600";
              return (
                <button
                  key={st.id}
                  onClick={() => handleQuickBook(st.name)}
                  className="group relative bg-[#050505] p-4 sm:p-5 text-left overflow-hidden min-h-[150px] flex flex-col justify-between"
                >
                  <span className="absolute inset-0 bg-[#e10600] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-xl">
                      {st.category === "ps5" ? "🎮" : st.category === "pc" ? "💻" : st.category === "sim" ? "🏎️" : "🎬"}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest group-hover:text-white" style={{ color: c }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c }} />
                      {st.status}
                    </span>
                  </div>
                  <div className="relative">
                    <h4 className="font-orbitron font-bold text-sm text-white truncate">{st.name}</h4>
                    <p className="font-mono text-[10px] text-white/50 group-hover:text-white/90 mt-1 truncate">
                      {st.status === "In-Use"
                        ? `${st.game || "In Match"} (${st.timeRemaining || "Active"})`
                        : st.status === "Reserved"
                        ? "Slot Reserved"
                        : "Ready to Play"}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Reserve station +
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ EXPERIENCE ZONES — interactive index ═══════════════════════════ */}
      <section id="zones" className="relative py-20 sm:py-28 px-5 sm:px-8 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-7">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Engineered For Immersion</span>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase leading-[0.9] mt-3">
                Arena Experience <span className="font-gothic normal-case text-[#e10600]">Zones</span>
              </h2>
            </div>
            <p className="lg:col-span-5 lg:self-end text-white/60 text-base leading-relaxed">
              Six dedicated gaming environments tailored for casual fun, tournament ranked grinds, high-octane racing, and gourmet relaxation.
            </p>
          </div>

          <div
            className="relative border-t border-white/15"
            onMouseMove={(e) => setPreview({ x: e.clientX, y: e.clientY, show: true })}
            onMouseLeave={() => setPreview((p) => ({ ...p, show: false }))}
            data-no-reveal
          >
            {ZONES.map((z, i) => {
              const open = activeZone === i;
              return (
                <div key={z.title} className="border-b border-white/15">
                  <button
                    onClick={() => setActiveZone(open ? -1 : i)}
                    onMouseEnter={() => setActiveZone(i)}
                    className="group w-full grid grid-cols-12 items-center gap-3 py-5 sm:py-7 text-left"
                    aria-expanded={open}
                  >
                    <span className={`col-span-2 sm:col-span-1 font-mono text-xs transition-colors ${open ? "text-[#e10600]" : "text-white/40"}`}>0{i + 1}</span>
                    <span
                      className={`col-span-8 sm:col-span-7 font-display uppercase text-3xl sm:text-5xl lg:text-6xl leading-none transition-all duration-500 ${
                        open ? "text-white translate-x-2 sm:translate-x-6" : "text-white/35 group-hover:text-white/70"
                      }`}
                    >
                      {z.title}
                    </span>
                    <span className="hidden sm:block col-span-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">{z.note}</span>
                    <span className={`col-span-2 sm:col-span-1 justify-self-end text-2xl transition-transform duration-500 ${open ? "rotate-45 text-[#e10600]" : "text-white/50"}`}>+</span>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-12 gap-3 pb-8">
                        <div className="col-span-12 sm:col-span-7 sm:col-start-2">
                          <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#e10600] mb-3">{z.meta}</p>
                          <p className="text-white/70 leading-relaxed max-w-2xl">{z.body}</p>
                        </div>
                        <div className="col-span-12 sm:col-span-3 sm:col-start-10 flex sm:justify-end items-end">
                          {z.href ? (
                            <Link href={z.href} className="btn-red-action">{z.cta} →</Link>
                          ) : (
                            <button onClick={() => handleQuickBook(z.preset!)} className="btn-red-action">{z.cta} →</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* floating preview following cursor (desktop) */}
            <div
              className="hidden lg:flex fixed top-0 left-0 z-30 pointer-events-none w-56 h-64 flex-col justify-between p-5 bg-[#8f0000] border border-[#e10600] shadow-crimson transition-[opacity,transform] duration-300 ease-out"
              style={{
                transform: `translate(${preview.x + 30}px, ${preview.y - 140}px) rotate(${preview.show ? -4 : 0}deg) scale(${preview.show && activeZone >= 0 ? 1 : 0.6})`,
                opacity: preview.show && activeZone >= 0 ? 1 : 0,
              }}
            >
              {activeZone >= 0 && (
                <>
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/70">Zone 0{activeZone + 1}</span>
                  <span className="text-7xl text-center">{ZONES[activeZone].icon}</span>
                  <span className="font-display text-xl uppercase leading-tight text-white">{ZONES[activeZone].title}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED GAMES ═══════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-8 border-t border-white/10 overflow-hidden">
        <div className="absolute -right-40 top-20 w-[500px] h-[500px] rounded-full bg-[#e10600]/10 blur-3xl pointer-events-none" />
        <div className="max-w-[1440px] mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Installed & Ready to Launch</span>
              <h2 className="font-display text-5xl sm:text-7xl uppercase leading-none mt-3">
                Featured <span className="text-[#e10600]">AAA Titles</span>
              </h2>
            </div>
            <div className="flex border border-white/15 self-start md:self-auto" data-no-reveal>
              {(["all", "ps5", "pc", "sim"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGameFilter(cat)}
                  className={`relative px-4 sm:px-5 h-10 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                    gameFilter === cat ? "bg-[#e10600] text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-no-reveal>
            {filteredGames.slice(0, 8).map((game) => (
              <Tilt key={game.id + gameFilter} className="group">
                <div className="relative border border-white/10 group-hover:border-[#e10600] bg-[#0b0b0c] overflow-hidden transition-colors">
                  <div className={`relative h-52 bg-gradient-to-br ${game.coverGradient} p-5 flex flex-col justify-between overflow-hidden`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.25),transparent_45%)]" />
                    <div className="relative flex items-center justify-between">
                      <span className="text-4xl drop-shadow-lg transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">{game.icon}</span>
                      {game.badge && (
                        <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 bg-black/70 text-white">{game.badge}</span>
                      )}
                    </div>
                    <div className="relative" style={{ transform: "translateZ(40px)" }}>
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70">{game.genre}</span>
                      <h4 className="font-display text-2xl uppercase leading-tight text-white">{game.title}</h4>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-white/45 uppercase tracking-wider">Display Quality</span>
                      <span className="text-white">{game.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/45 uppercase tracking-wider">Framerate</span>
                      <span className="text-emerald-400">{game.framerate}</span>
                    </div>
                    <button
                      onClick={() => handleQuickBook(game.title)}
                      className="w-full mt-2 h-10 border border-white/15 uppercase tracking-[0.2em] text-white group-hover:bg-[#e10600] group-hover:border-[#e10600] transition-colors"
                    >
                      Play This Title ⚡
                    </button>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ REVIEWS — draggable reel ═══════════════════════════ */}
      <section className="relative py-20 sm:py-28 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Community Voice</span>
            <h2 className="font-display text-5xl sm:text-7xl uppercase leading-none mt-3">
              Verified <span className="font-gothic normal-case text-[#e10600]">Gamer</span> Reviews
            </h2>
            <p className="text-white/55 mt-4 max-w-lg">Hear what champions and squads from Ranaghat say about their sessions at Virtux.</p>
          </div>
          <Link href="/feedback" className="btn-white-action self-start md:self-auto">Leave Your Review or View All</Link>
        </div>

        <ReviewReel reviews={reviews} />
      </section>

      {/* ═══════════════════════════ FINAL CTA ═══════════════════════════ */}
      <section className="relative overflow-hidden border-t border-white/10" data-no-reveal>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,#8f0000,transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="#e10600" strokeWidth="0.08" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#e10600" strokeWidth="0.08" />
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="#e10600" strokeWidth="0.08" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#e10600" strokeWidth="0.08" />
          </svg>
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 py-24 sm:py-36 text-center">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">Sanctuary For Gamers</span>
          <h2 className="font-display uppercase leading-[0.85] mt-4 text-[15vw] sm:text-[11vw]">
            Ready to take
            <br />
            your <span className="font-gothic normal-case text-[#e10600]">seat?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/65 mt-8 leading-relaxed">
            Experience Ranaghat&apos;s premier gaming pods, force-feedback motion simulators, and in-seat gourmet café. Reserve your spot or walk into the hub today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Magnetic>
              <button onClick={() => handleQuickBook("PlayStation 5 (Console + Controller)")} className="btn-red-action text-sm">
                Play Now
              </button>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className="btn-white-action">Find Our Location</Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── Review reel: drag / swipe + auto drift ───────────────────────── */
type Review = { id: string; name: string; rating: number; comment: string; service: string; avatarLetter: string };

const ReviewReel: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      const el = track.current;
      if (el && !paused && !drag.current.down) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const list = [...reviews, ...reviews];

  return (
    <div
      ref={track}
      className="flex gap-5 overflow-x-auto px-5 sm:px-8 pb-4 cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        drag.current.down = false;
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setPaused(false), 2500)}
      onMouseDown={(e) => {
        drag.current = { down: true, x: e.pageX, left: track.current!.scrollLeft, moved: false };
      }}
      onMouseUp={() => (drag.current.down = false)}
      onMouseMove={(e) => {
        if (!drag.current.down) return;
        const dx = e.pageX - drag.current.x;
        track.current!.scrollLeft = drag.current.left - dx;
      }}
      data-no-reveal
    >
      {list.map((rev, i) => (
        <article
          key={rev.id + "-" + i}
          className="group shrink-0 w-[80vw] sm:w-[380px] border border-white/10 hover:border-[#e10600] bg-[#0b0b0c] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] transition-colors"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#e10600] tracking-[0.2em]">{"★".repeat(rev.rating)}</span>
              <span className="font-gothic text-5xl text-white/10 group-hover:text-[#e10600]/40 transition-colors leading-none">&ldquo;</span>
            </div>
            <p className="mt-3 text-white/80 leading-relaxed">{rev.comment}</p>
          </div>
          <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/10">
            <div className="w-10 h-10 bg-[#e10600] flex items-center justify-center font-display text-lg text-white">{rev.avatarLetter}</div>
            <div>
              <h5 className="font-orbitron font-bold text-sm text-white">{rev.name}</h5>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#e10600]">{rev.service}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
