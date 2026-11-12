"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { GAMES_DATA } from "@/data/gamesData";
import { NinjaHead3D } from "@/components/NinjaHead3D";
import { Logo3D } from "@/components/Logo3D";
import { BootLoader, Magnetic } from "@/components/FX";
import { GameIcon, CategoryIcon, StarRating, Zap } from "@/components/Icons";
import { SplitReveal, ScriptDraw, ScrubWords, RunningLine, Scramble, usePinProgress, useInViewOnce, seg, clamp01 } from "@/components/TextFX";

/* ───────────────────────── content ───────────────────────── */
const ZONES = [
  {
    icon: "ps5",
    script: "Console",
    title: "Console Arena (PS5)",
    meta: "Starting at ₹80 / 30 mins · 4K 120Hz Displays",
    body: "Dedicated PlayStation 5 stations with ultra-low input lag HDR gaming displays, sanitized DualSense haptic controllers, and a complete library of 100+ titles including EA FC 25, Tekken 8, and Spider-Man 2.",
    cta: "Book PS5 Pod",
    preset: "PlayStation 5 (Console + Controller)",
    note: "6 Pods Online",
  },
  {
    icon: "pc",
    script: "Battle Rig",
    title: "RTX Battle Stations",
    meta: "Starting at ₹65 / 30 mins · 240Hz to 360Hz Monitors",
    body: "Liquid-cooled gaming PCs powered by NVIDIA GeForce RTX 3060, 4070, and flagship 4090 GPUs. Mechanical keyboards, studio headsets, and zero-jitter optical fiber LAN tuned for Valorant and CS2.",
    cta: "Book PC Rig",
    preset: "Gaming PC Battle Station (RTX Rigs)",
    note: "Sub-10ms Ping",
  },
  {
    icon: "sim",
    script: "Sim Racing",
    title: "Motion Sim Cockpit",
    meta: "Starting at ₹70 / 30 mins · Logitech G29 Force Feedback",
    body: "Experience authentic racing physics with dual-motor force feedback, responsive load-cell pedals, and full bucket seating. Master Gran Turismo 7, F1 23, and Forza Horizon 5.",
    cta: "Book Cockpit",
    preset: "Racing Simulator (Logitech G29)",
    note: "GT7 & F1 Ready",
  },
  {
    icon: "cinema",
    script: "Cinema",
    title: "Private Dolby Cinema",
    meta: "Starting at ₹40 / 1 hr (Up to 3 guests included)",
    body: "Giant 150-inch 4K laser projection with 7.2 Dolby Atmos surround audio. Perfect for private OTT watch parties (Netflix, Prime, Hotstar), anime marathons, and live tournament screenings.",
    cta: "Book Cinema Suite",
    preset: "Dolby Cinema & OTT Suite",
    note: "Squad Suite",
  },
  {
    icon: "cafe",
    script: "Café",
    title: "Virtux Café & Bites",
    meta: "Artisan Coffee, Monster Cans & Hot Bites",
    body: "Fuel up without leaving your station. Enjoy fresh espresso, chilled blue mocktails, loaded peri-peri fries, crispy chicken burgers, and molten lava cakes delivered directly to your desk.",
    cta: "Order Food Online",
    href: "/cafe",
    note: "In-Seat Delivery",
  },
  {
    icon: "events",
    script: "Esports",
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


const CREED =
  "We don't rent screens. We build nights your squad will still be arguing about next week — from the first controller you grab to the last fry you steal across the table.";

const STEPS = [
  { n: "01", title: "Reserve", body: "Pick your rig, your slot and your squad size online or on WhatsApp. Live station telemetry shows what's free right now.", tag: "60 seconds" },
  { n: "02", title: "Check in", body: "Walk in, show your booking code at the desk. Your station is wiped down, controllers charged and the game already installed.", tag: "Zero waiting" },
  { n: "03", title: "Play", body: "4K 120Hz consoles, 360Hz RTX rigs and force-feedback cockpits on gigabit fiber. Run over time? It's billed by the minute.", tag: "Sub-10ms ping" },
  { n: "04", title: "Refuel", body: "Order from the Virtux Café without pausing. Espresso, mocktails, peri-peri fries and burgers land right at your desk.", tag: "In-seat delivery" },
];

/* ───────────────────────── helpers ───────────────────────── */
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
  </span>
);

/* Flames divider */
const Flames: React.FC<{ flip?: boolean; className?: string }> = ({ flip, className = "" }) => (
  <div className={`relative h-28 sm:h-44 overflow-hidden pointer-events-none ${flip ? "rotate-180" : ""} ${className}`} aria-hidden>
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

/* Crosshair frame (draws itself with progress) */
const Crosshair: React.FC<{ k: number; className?: string }> = ({ k, className = "" }) => {
  const L = (len: number) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - k) });
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={className} aria-hidden>
      <g stroke="#e10600" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.55">
        <line x1="0" y1="0" x2="1000" y2="1000" style={L(1415)} vectorEffect="non-scaling-stroke" />
        <line x1="1000" y1="0" x2="0" y2="1000" style={L(1415)} vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="500" x2="1000" y2="500" style={L(1000)} vectorEffect="non-scaling-stroke" />
        <line x1="500" y1="0" x2="500" y2="1000" style={L(1000)} vectorEffect="non-scaling-stroke" />
        <rect x="250" y="250" width="500" height="500" style={L(2000)} vectorEffect="non-scaling-stroke" />
        <polygon points="500,180 820,500 500,820 180,500" style={L(1810)} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
};

/* ───────────────────────── PAGE ───────────────────────── */
export default function HomePage() {
  const { stations, setIsBookingOpen, setBookingServicePreset, reviews } = useStore();
  const [activeSlide, setActiveSlide] = useState(1);
  const [booted, setBooted] = useState(true);
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

  useEffect(() => {
    const id = window.setInterval(() => setActiveSlide((s) => (s < 3 ? s + 1 : 1)), 4200);
    return () => window.clearInterval(id);
  }, []);

  const availableStationsCount = stations.filter((s) => s.status === "Available").length;

  const handleQuickBook = (preset: string) => {
    setBookingServicePreset(preset);
    setIsBookingOpen(true);
  };

  /* pinned scenes */
  const [heroRef, heroP] = usePinProgress<HTMLElement>();
  const [creedRef, creedP] = usePinProgress<HTMLElement>();
  const [zoneRef, zoneP] = usePinProgress<HTMLElement>();
  const [showRef, showP] = usePinProgress<HTMLElement>();

  // creed: words fly in from scattered positions
  const words = useMemo(() => CREED.split(" "), []);
  const scatter = useMemo(
    () => words.map((_, i) => ({ x: ((i * 7919) % 700) - 350, y: ((i * 104729) % 460) - 230, r: ((i * 31) % 70) - 35 })),
    [words]
  );
  const assemble = seg(creedP, 0.3, 0.8);

  // stats
  const [statsRef, statsSeen] = useInViewOnce<HTMLDivElement>(0.25);
  const s1 = useCountUp(ZONES.length, statsSeen);
  const s2 = useCountUp(100, statsSeen);
  const s3 = useCountUp(stations.length, statsSeen);
  const s4 = useCountUp(65, statsSeen);

  // zone index driven by scroll
  const zIdx = Math.min(ZONES.length - 1, Math.floor(seg(zoneP, 0.08, 0.98) * ZONES.length));
  const zone = ZONES[zIdx];

  // game showcase
  const [gameFilter, setGameFilter] = useState<"all" | "ps5" | "pc" | "sim">("all");
  const games = GAMES_DATA.filter((g) => gameFilter === "all" || g.category === gameFilter || g.category === "all").slice(0, 6);
  const gFloat = seg(showP, 0.05, 0.95) * (games.length - 1);
  const gIdx = Math.round(gFloat);
  const game = games[Math.min(gIdx, games.length - 1)];

  return (
    <div className="relative bg-[#050505] text-white -mt-16 overflow-x-clip">
      {!booted && <BootLoader onEnter={finishBoot} />}
      <HomeHUD onPlay={() => handleQuickBook(SLIDE_PRESETS[0])} />

      {/* ═══════════════════════════ HERO (pinned) ═══════════════════════════ */}
      <section ref={heroRef} className="relative h-[190vh]" data-no-reveal>
        <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden">
          {/* backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_10%,#e10600_0%,#8f0000_32%,#2a0000_62%,#050505_100%)]" />
          <div className="absolute inset-0 light-dot-grid opacity-40" />
          <div
            className="absolute inset-0 bg-[#050505] pointer-events-none"
            style={{ opacity: seg(heroP, 0.45, 1) * 0.85 }}
          />

          {/* running headline behind the operator */}
          <div
            className="absolute inset-x-0 top-[40%] sm:top-[36%] -translate-y-1/2 pointer-events-none"
            style={{ transform: `translateY(${heroP * -160}px)`, opacity: 1 - seg(heroP, 0.4, 0.8) }}
          >
            <RunningLine speed={60}>
              {["Play", "Eat", "Chill", "Repeat"].map((w) => (
                <span key={w} className="font-bebas text-[30vw] sm:text-[22vw] leading-[0.8] text-white/95 px-[3vw] flex items-center">
                  {w}
                  <span className="text-[#e10600] text-[10vw] ml-[4vw]">+</span>
                </span>
              ))}
            </RunningLine>
          </div>

          {/* 3D emblem: the backdrop of the operator; grows as you scroll */}
          <div
            className="absolute left-1/2 top-[40%] sm:top-[41%] w-[min(98vw,80svh,760px)] aspect-square pointer-events-none"
            style={{ transform: `translate(-50%, -50%) translateY(${heroP * 6}%) scale(${1 + heroP * 0.12})` }}
          >
            <Logo3D className="w-full h-full" scrollSpin />
          </div>

          {/* 3D head */}
          <div
            className="absolute left-1/2 top-[16%] sm:top-[13%] w-[100vw] sm:w-[78vw] md:w-[60vw] lg:w-[46vw] max-w-[680px] h-[58svh] sm:h-[66svh] lg:h-[74svh] z-10"
            style={{
              transform: `translate(-50%, ${heroP * 140}px) scale(${1 - heroP * 0.12})`,
              opacity: 1 - seg(heroP, 0.4, 0.75),
            }}
          >
            <NinjaHead3D className="w-full h-full" />
          </div>

          {/* top meta row */}
          <div className="absolute top-24 sm:top-28 inset-x-0 z-30 px-5 sm:px-8 max-w-[1440px] mx-auto flex justify-between items-start pointer-events-none">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/85">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Scramble text="Ranaghat's First Premium Gaming Hub" />
            </div>
            <div className="hidden sm:block text-right font-mono text-[11px] tracking-[0.25em] uppercase text-white/70">
              Open Daily<br />10 AM – 9:30 PM
            </div>
          </div>

          {/* mobile headline */}
          <div className="md:hidden absolute z-30 inset-x-5 top-36 text-center pointer-events-none">
            <p className="font-mono text-[11px] tracking-[0.4em] text-white/90">PLAY · EAT · CHILL</p>
          </div>

          {/* late-scroll title: enter the arena */}
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-5"
            style={{ opacity: seg(heroP, 0.55, 0.85) }}
          >
            <ScriptDraw text="enter" progress={seg(heroP, 0.5, 0.9)} className="w-[80vw] max-w-[700px] h-auto -mb-[6vw] sm:-mb-12" size={170} />
            <h1
              className="font-bebas uppercase text-[20vw] sm:text-[14vw] leading-[0.82] text-white"
              style={{ letterSpacing: `${(1 - seg(heroP, 0.55, 0.95)) * 0.3}em` }}
            >
              The Arena
            </h1>
          </div>

          {/* sound */}
          <div className="absolute z-30 left-5 sm:left-8 bottom-20 sm:bottom-24 flex items-center gap-5" style={{ opacity: 1 - seg(heroP, 0.2, 0.45) }}>
            <button onClick={ambient.toggle} className="flex items-center gap-3 group" aria-label={ambient.on ? "Mute arena ambience" : "Play arena ambience"}>
              <SoundBars on={ambient.on} />
              <span className="hidden sm:inline font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 group-hover:text-white">
                Sound {ambient.on ? "on" : "off"}
              </span>
            </button>
          </div>

          {/* live booking card */}
          <button
            onClick={() => handleQuickBook(SLIDE_PRESETS[activeSlide - 1])}
            className="absolute z-30 right-4 sm:right-8 bottom-16 sm:bottom-24 group flex items-stretch rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md border border-white/15 hover:border-[#e10600] transition-colors text-left"
            style={{ opacity: 1 - seg(heroP, 0.2, 0.45), pointerEvents: heroP > 0.4 ? "none" : "auto" }}
          >
            <div className="w-16 sm:w-24 relative overflow-hidden bg-[#8f0000]">
              <div key={activeSlide} className="absolute inset-0 flex items-center justify-center text-white" style={{ animation: "heroIn .6s both" }}>
                <CategoryIcon category={["ps5", "pc", "sim"][activeSlide - 1]} className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute inset-x-0 h-4 bg-white/20 animate-scan" />
            </div>
            <div className="px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/70">
                Live <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse" />
                <span className="text-emerald-400">{availableStationsCount}/{stations.length} free</span>
              </div>
              <p className="font-bebas text-xl sm:text-2xl text-white leading-tight">{SLIDES[activeSlide - 1]}</p>
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/50 group-hover:text-[#e10600] transition-colors">
                Tap to quick reserve →
              </p>
            </div>
          </button>

          {/* scroll cue */}
          <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-16 hidden lg:flex flex-col items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-white/50" style={{ opacity: 1 - seg(heroP, 0, 0.15) }}>
            Scroll
            <span className="w-px h-8 bg-white/30 relative overflow-hidden">
              <span className="absolute inset-x-0 h-3 bg-white animate-scan" />
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ MARQUEE BAND ═══════════════════════════ */}
      <div className="relative bg-[#e10600] text-black py-3 sm:py-4 overflow-hidden -rotate-1 scale-[1.02] border-y border-black z-20" aria-hidden>
        <RunningLine speed={70}>
          {["Ranaghat's First Premium Gaming Hub", "PS5 4K 120Hz", "RTX Battle Rigs", "Motion Simulators", "Dolby Cinema", "Gamer Café", "Weekly Cash Cups"].map((t) => (
            <span key={t} className="flex items-center font-bebas text-3xl sm:text-5xl uppercase px-6">
              {t}
              <span className="ml-12 text-2xl">+</span>
            </span>
          ))}
        </RunningLine>
      </div>

      {/* ═══════════════════════════ CREED (pinned: headline + scattered words assemble) ═══════════════════════════ */}
      <section ref={creedRef} className="relative h-[230vh]" data-no-reveal>
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center px-5 sm:px-8">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 40% at 50% ${60 - creedP * 20}%, rgba(225,6,0,${0.12 + creedP * 0.18}), transparent 70%)` }} />
          <div className="relative max-w-[1440px] mx-auto w-full text-center">
            <h2 className="font-bebas uppercase leading-[0.82] text-[19vw] sm:text-[13vw] text-[#e10600]" style={{ transform: `translateY(${(1 - seg(creedP, 0, 0.3)) * 40}px)`, opacity: 0.2 + seg(creedP, 0, 0.25) * 0.8 }}>
              Every match
            </h2>
            <div className="relative -my-[5vw] sm:-my-[4vw] z-10">
              <ScriptDraw text="hits" progress={seg(creedP, 0.05, 0.35)} className="w-[70vw] max-w-[620px] h-auto mx-auto" size={190} viewW={700} />
            </div>
            <h2 className="font-bebas uppercase leading-[0.82] text-[19vw] sm:text-[13vw] text-[#e10600]" style={{ transform: `translateX(${(1 - seg(creedP, 0.1, 0.4)) * 10}vw)` }}>
              Different
            </h2>
            <p className="mt-10 sm:mt-14 max-w-4xl mx-auto font-orbitron uppercase text-base sm:text-2xl lg:text-[1.7rem] leading-snug">
              {words.map((w, i) => {
                const k = clamp01(assemble * 1.4 - (i / words.length) * 0.4);
                const s = scatter[i];
                return (
                  <span
                    key={i}
                    className="inline-block mr-[0.3em] will-change-transform"
                    style={{
                      transform: `translate(${s.x * (1 - k)}px, ${s.y * (1 - k)}px) rotate(${s.r * (1 - k)}deg)`,
                      opacity: 0.12 + k * 0.88,
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
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_50%_40%,#ff2a1f,transparent_60%)]" />
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
            <div key={s.label} className="group grid grid-cols-12 items-center gap-4 py-6 sm:py-8 border-b border-black/25 last:border-0 cursor-default">
              <span className="col-span-2 sm:col-span-1 font-mono text-xs text-black/50">0{i + 1}</span>
              <span className="col-span-10 sm:col-span-5 font-script text-8xl sm:text-9xl lg:text-[10rem] leading-[0.9] text-black transition-all duration-500 group-hover:translate-x-4 group-hover:text-white">
                {s.suffix === "₹" ? `₹${s.v}` : `${s.v}${s.suffix}`}
              </span>
              <div className="col-span-12 sm:col-span-6 sm:text-right">
                <p className="font-bebas text-3xl sm:text-5xl uppercase text-black leading-none">{s.label}</p>
                <p className="font-orbitron text-sm sm:text-base uppercase text-black/85 font-medium mt-1 max-w-md sm:ml-auto">{s.line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Flames flip />

      {/* ═══════════════════════════ ZONES (pinned crosshair showcase) ═══════════════════════════ */}
      <section id="zones" ref={zoneRef} className="relative" style={{ height: `${ZONES.length * 70 + 60}vh` }} data-no-reveal>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <Crosshair k={seg(zoneP, 0, 0.12)} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_50%_50%,rgba(225,6,0,0.18),transparent_70%)]" />

          {/* center script word */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div key={zIdx} className="w-full max-w-[1000px]" style={{ animation: "heroIn .7s cubic-bezier(0.16,1,0.3,1) both" }}>
              <ScriptDraw text={zone.script} className="w-full h-auto" size={zone.script.length > 8 ? 150 : 190} viewW={1000} viewH={260} />
            </div>
          </div>

          {/* header */}
          <div className="absolute top-24 sm:top-28 inset-x-0 px-5 sm:px-8 max-w-[1440px] mx-auto flex justify-between items-start">
            <div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Engineered For Immersion</span>
              <h2 className="font-bebas text-4xl sm:text-6xl uppercase leading-none mt-2">Arena Experience Zones</h2>
            </div>
            <span className="font-bebas text-5xl sm:text-7xl text-white/90 tabular-nums leading-none">
              0{zIdx + 1}<span className="text-white/30 text-2xl sm:text-3xl">/0{ZONES.length}</span>
            </span>
          </div>

          {/* left index */}
          <ul className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
            {ZONES.map((z, i) => (
              <li key={z.title} className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ${i === zIdx ? "text-white translate-x-2" : "text-white/30"}`}>
                <span className={`h-px transition-all duration-500 ${i === zIdx ? "w-10 bg-[#e10600]" : "w-4 bg-white/30"}`} />
                {z.title}
              </li>
            ))}
          </ul>

          {/* bottom detail */}
          <div className="absolute bottom-20 sm:bottom-24 inset-x-0 px-5 sm:px-8 max-w-[1440px] mx-auto grid md:grid-cols-12 gap-5 items-end">
            <div key={"d" + zIdx} className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 md:text-right" style={{ animation: "heroIn .7s .1s cubic-bezier(0.16,1,0.3,1) both" }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#e10600] mb-2">{zone.meta}</p>
              <p className="text-white/75 text-sm sm:text-base leading-relaxed">{zone.body}</p>
              <div className="mt-5 flex md:justify-end items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50">{zone.note}</span>
                {zone.href ? (
                  <Link href={zone.href} className="btn-red-action">{zone.cta} →</Link>
                ) : (
                  <button onClick={() => handleQuickBook(zone.preset!)} className="btn-red-action">{zone.cta} →</button>
                )}
              </div>
            </div>
          </div>

          {/* progress rail */}
          <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 h-40 w-px bg-white/10">
            <div className="absolute top-0 inset-x-0 bg-[#e10600]" style={{ height: `${zoneP * 100}%` }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ LIVE ARENA OCCUPANCY ═══════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-8 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Real-Time Station Telemetry</span>
              <SplitReveal as="h2" text="Live Arena Occupancy" className="font-bebas text-6xl sm:text-8xl uppercase leading-[0.9] mt-3" />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" />Available</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" />Reserved</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#e10600]" />In-use</span>
              <Link href="/pricing" className="hidden lg:inline text-white hover:text-[#e10600]">Full rates →</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stations.map((st) => {
              const c = st.status === "Available" ? "#34d399" : st.status === "Reserved" ? "#fbbf24" : "#e10600";
              return (
                <button
                  key={st.id}
                  onClick={() => handleQuickBook(st.name)}
                  className="group relative rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 sm:p-5 text-left overflow-hidden min-h-[150px] flex flex-col justify-between hover:border-[#e10600] transition-colors"
                >
                  <span className="absolute inset-0 bg-[#e10600] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-white/80 group-hover:text-white">
                      <CategoryIcon category={st.category} className="w-5 h-5" />
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest group-hover:text-white" style={{ color: c }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c }} />
                      {st.status}
                    </span>
                  </div>
                  <div className="relative">
                    <h4 className="font-orbitron font-bold text-sm text-white truncate">{st.name}</h4>
                    <p className="font-mono text-[10px] text-white/50 group-hover:text-white/90 mt-1 truncate">
                      {st.status === "In-Use" ? `${st.game || "In Match"} (${st.timeRemaining || "Active"})` : st.status === "Reserved" ? "Slot Reserved" : "Ready to Play"}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Reserve station +</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED TITLES (pinned showcase) ═══════════════════════════ */}
      <section ref={showRef} className="relative border-t border-white/10" style={{ height: `${games.length * 60 + 80}vh` }} data-no-reveal>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* blurred colour wash of the active title */}
          <div key={"bg" + game.id} className={`absolute -inset-20 bg-gradient-to-br ${game.coverGradient} blur-3xl opacity-60 scale-110`} style={{ animation: "fadeIn .8s both" }} />
          <div className="absolute inset-0 bg-[#050505]/55" />

          <div className="absolute top-24 sm:top-28 inset-x-0 px-5 sm:px-8 max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
            <div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Installed & Ready to Launch</span>
              <h2 className="font-bebas text-5xl sm:text-7xl uppercase leading-none mt-2">
                Featured <span className="font-script normal-case text-[#e10600] text-6xl sm:text-8xl">titles</span>
              </h2>
            </div>
            <div className="flex rounded-full border border-white/15 p-1 self-start sm:self-auto bg-black/40 backdrop-blur">
              {(["all", "ps5", "pc", "sim"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGameFilter(cat)}
                  className={`px-4 h-9 rounded-full font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${gameFilter === cat ? "bg-[#e10600] text-white" : "text-white/60 hover:text-white"}`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-5 pt-28 sm:pt-16">
            <div className="relative w-full max-w-[1440px] grid grid-cols-12 items-center gap-4">
              {/* title */}
              <div className="col-span-12 md:col-span-3 order-2 md:order-1 text-center md:text-left">
                <div key={"t" + game.id} style={{ animation: "heroIn .6s both" }}>
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">{game.genre}</span>
                  <h3 className="font-bebas text-4xl sm:text-6xl uppercase leading-[0.9] text-white mt-1">{game.title}</h3>
                </div>
              </div>

              {/* card stack */}
              <div className="col-span-12 md:col-span-6 order-1 md:order-2 relative h-[42svh] sm:h-[50svh] [perspective:1200px]">
                {games.map((g, i) => {
                  const d = i - gFloat;
                  const vis = Math.abs(d) < 2.2;
                  return (
                    <div
                      key={g.id}
                      className={`absolute inset-x-[6%] sm:inset-x-[10%] inset-y-0 rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br ${g.coverGradient} shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]`}
                      style={{
                        transform: `translateY(${d * 62}%) scale(${1 - Math.min(1, Math.abs(d)) * 0.35}) rotateX(${d * -18}deg)`,
                        opacity: vis ? 1 - Math.min(1, Math.abs(d)) * 0.6 : 0,
                        zIndex: 10 - Math.round(Math.abs(d) * 2),
                        filter: `blur(${Math.min(6, Math.abs(d) * 5)}px)`,
                      }}
                    >
                      <div className="absolute inset-0 light-dot-grid opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GameIcon name={g.icon} className="w-24 h-24 sm:w-36 sm:h-36 drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]" color={g.accentColor} />
                      </div>
                      <span className="absolute left-5 top-5 font-bebas text-6xl text-white/15 leading-none">0{i + 1}</span>
                      {g.badge && (
                        <span className="absolute right-5 top-5 font-mono text-[9px] tracking-widest uppercase px-3 py-1 rounded-full bg-black/70 text-white border border-white/10">{g.badge}</span>
                      )}
                      <span className="absolute inset-x-0 bottom-0 p-5 font-bebas text-3xl sm:text-4xl text-white uppercase bg-gradient-to-t from-black/80 to-transparent">{g.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* specs */}
              <div className="col-span-12 md:col-span-3 order-3 text-center md:text-right">
                <div key={"s" + game.id} style={{ animation: "heroIn .6s .08s both" }} className="font-mono text-[11px] space-y-1.5">
                  <p><span className="text-white/45 uppercase tracking-wider">Display </span><span className="text-white">{game.resolution}</span></p>
                  <p><span className="text-white/45 uppercase tracking-wider">Framerate </span><span className="text-emerald-400">{game.framerate}</span></p>
                  <button
                    onClick={() => handleQuickBook(game.title)}
                    className="mt-3 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#fff] text-black hover:bg-[#e10600] hover:text-white uppercase tracking-[0.2em] transition-colors"
                  >
                    Play this title <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* counter */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {games.map((g, i) => (
              <span key={g.id} className={`h-1 rounded-full transition-all duration-500 ${i === gIdx ? "w-10 bg-[#e10600]" : "w-3 bg-white/25"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ HOW A SESSION RUNS (stacking cards) ═══════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-8 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-6 mb-14">
            <div className="lg:col-span-7">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ From Lobby to Victory</span>
              <h2 className="font-bebas text-6xl sm:text-8xl uppercase leading-[0.88] mt-3">
                How a session <span className="font-script normal-case text-[#e10600]">runs</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:self-end">
              <SessionScrub />
            </div>
          </div>

          <div className="relative" data-no-reveal>
            {STEPS.map((s, i) => (
              <div key={s.n} className="sticky" style={{ top: `${96 + i * 22}px` }}>
                <div
                  className="relative mb-6 rounded-[28px] border border-white/10 overflow-hidden p-6 sm:p-10 min-h-[260px] sm:min-h-[300px] grid sm:grid-cols-12 gap-6 items-end shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.9)]"
                  style={{ background: i % 2 ? "linear-gradient(135deg,#120606,#0a0a0b)" : "linear-gradient(135deg,#8f0000,#3a0000)" }}
                >
                  <span className="absolute -right-4 -top-10 font-bebas text-[12rem] sm:text-[16rem] leading-none text-white/[0.06] select-none">{s.n}</span>
                  <div className="sm:col-span-5">
                    <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-black/40 border border-white/15 font-mono text-[10px] tracking-[0.25em] uppercase text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e10600]" />
                      {s.tag}
                    </span>
                    <h3 className="font-bebas text-6xl sm:text-8xl uppercase leading-none text-white mt-4">{s.title}</h3>
                  </div>
                  <p className="sm:col-span-6 sm:col-start-7 text-white/80 text-base sm:text-lg leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ REVIEWS — draggable reel ═══════════════════════════ */}
      <section className="relative py-20 sm:py-28 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">/ Community Voice</span>
            <h2 className="font-bebas text-6xl sm:text-8xl uppercase leading-[0.9] mt-3">
              Verified <span className="font-script normal-case text-[#e10600]">gamer</span> reviews
            </h2>
            <p className="text-white/55 mt-4 max-w-lg">Hear what champions and squads from Ranaghat say about their sessions at Virtux.</p>
          </div>
          <Link href="/feedback" className="btn-white-action self-start md:self-auto rounded-full">Leave Your Review or View All</Link>
        </div>
        <ReviewReel reviews={reviews} />
      </section>

      {/* ═══════════════════════════ FINAL CTA: the Virtux pass ═══════════════════════════ */}
      <FinalCTA onPlay={() => handleQuickBook("PlayStation 5 (Console + Controller)")} />

      <style jsx global>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); filter: blur(6px); }
          to { opacity: 1; transform: none; filter: none; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 0.6; } }
        @keyframes bar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}

/* ───────────────────────── session intro paragraph (scroll-scrubbed) ───────────────────────── */
const SessionScrub: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(clamp01((window.innerHeight * 0.9 - r.top) / (window.innerHeight * 0.6)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref}>
      <ScrubWords
        progress={p}
        className="font-orbitron uppercase text-lg sm:text-xl leading-snug"
        text="Four steps. No queues, no surprises. You bring the squad — we handle the rigs, the ping and the fries."
      />
    </div>
  );
};

/* ───────────────────────── fixed bottom HUD (home only) ───────────────────────── */
const HomeHUD: React.FC<{ onPlay: () => void }> = ({ onPlay }) => {
  const [p, setP] = useState(0);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    const foot = document.querySelector("footer");
    const io = foot ? new IntersectionObserver(([e]) => setHide(e.isIntersecting), { threshold: 0.05 }) : null;
    if (foot && io) io.observe(foot);
    return () => {
      window.removeEventListener("scroll", on);
      io?.disconnect();
    };
  }, []);
  const ticks = 28;
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 transition-transform duration-500 ${hide ? "translate-y-full" : "translate-y-0"}`}
      data-no-reveal
    >
      {/* progress ticks */}
      <div className="absolute -top-6 left-5 sm:left-8 flex items-end gap-[3px] h-4" aria-hidden>
        {Array.from({ length: ticks }).map((_, i) => (
          <span key={i} className="w-[2px] h-full transition-colors duration-200" style={{ background: i / ticks < p ? "#e10600" : "rgba(225,6,0,0.25)" }} />
        ))}
      </div>
      <div className="border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-11 flex items-center justify-between font-bebas text-base sm:text-lg tracking-[0.25em] uppercase">
          {["+", "Play", "+", "Eat", "+", "Chill", "+"].map((w, i) =>
            w === "+" ? (
              <span key={i} className="text-white/50 text-lg font-mono transition-transform duration-500 hover:rotate-90">+</span>
            ) : (
              <button
                key={i}
                onClick={() => (w === "Eat" ? (window.location.href = "/cafe") : w === "Play" ? onPlay() : document.getElementById("zones")?.scrollIntoView({ behavior: "smooth" }))}
                className="text-white hover:text-[#e10600] transition-colors glitch"
              >
                {w}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── final CTA ───────────────────────── */
const FinalCTA: React.FC<{ onPlay: () => void }> = ({ onPlay }) => {
  const card = useRef<HTMLDivElement>(null);
  const [ref, p] = usePinProgress<HTMLElement>();
  return (
    <section ref={ref} className="relative h-[170vh] border-t border-white/10" data-no-reveal>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_20%_0%,rgba(225,6,0,0.45),transparent_60%),linear-gradient(to_bottom,#050505,#1a0000_55%,#8f0000)]" />
        {/* shard floor */}
        <svg className="absolute inset-x-0 bottom-0 w-full h-[34%]" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 22 }).map((_, i) => {
            const x = (i * 71) % 1440;
            const y = 40 + ((i * 53) % 220);
            const w = 120 + ((i * 37) % 160);
            return (
              <polygon
                key={i}
                points={`${x},${y} ${x + w},${y + 30 + (i % 3) * 20} ${x + w * 0.4},${y + 90}`}
                fill={i % 3 ? "#2a0000" : "#4a0000"}
                stroke="#e10600"
                strokeWidth="1"
                opacity={0.7}
              />
            );
          })}
        </svg>

        <div className="relative h-full max-w-[1440px] mx-auto px-5 sm:px-8 grid lg:grid-cols-2 items-center gap-10 pt-24 pb-28">
          <div style={{ opacity: seg(p, 0, 0.3), transform: `translateY(${(1 - seg(p, 0, 0.3)) * 40}px)` }}>
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">Sanctuary For Gamers</span>
            <h2 className="font-bebas uppercase leading-[0.85] mt-4 text-[17vw] sm:text-[10vw] lg:text-[7.5vw]">
              Ready to take your <span className="font-script normal-case text-[#e10600]">seat?</span>
            </h2>
            <p className="max-w-xl text-white/70 mt-6 leading-relaxed">
              Experience Ranaghat&apos;s premier gaming pods, force-feedback motion simulators, and in-seat gourmet café. Reserve your spot or walk into the hub today.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Magnetic>
                <button onClick={onPlay} className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#e10600] hover:bg-white hover:text-black text-white font-mono font-bold text-xs tracking-[0.2em] uppercase transition-colors shadow-crimson">
                  Play Now
                </button>
              </Magnetic>
              <Magnetic>
                <Link href="/contact" className="inline-flex items-center h-12 px-8 rounded-full border border-white/25 hover:border-white text-white font-mono text-xs tracking-[0.2em] uppercase transition-colors">
                  Find Our Location
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* the pass */}
          <div className="hidden sm:flex justify-center [perspective:1400px]">
            <div
              ref={card}
              onMouseMove={(e) => {
                const el = card.current;
                if (!el) return;
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty("--ry", `${x * 22}deg`);
                el.style.setProperty("--rx", `${-y * 18}deg`);
                el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
              }}
              onMouseLeave={() => {
                card.current?.style.setProperty("--ry", "0deg");
                card.current?.style.setProperty("--rx", "0deg");
              }}
              className="relative w-[340px] lg:w-[400px] aspect-[3/4] rounded-[28px] p-8 bg-[#e8352a] text-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(calc(var(--rx,0deg) + ${(1 - seg(p, 0.1, 0.5)) * 50}deg)) rotateY(calc(var(--ry,0deg) - 12deg)) rotateZ(-4deg) translateY(${(1 - seg(p, 0.1, 0.5)) * 120}px)`,
                opacity: seg(p, 0.05, 0.3),
              }}
              data-cursor
            >
              <div className="absolute inset-0 rounded-[28px] pointer-events-none bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.35)_var(--gx,50%),transparent_70%)] mix-blend-overlay" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon-3d.png" alt="" className="w-14 h-14 object-contain mix-blend-screen" />
              <p className="font-bebas text-5xl lg:text-6xl leading-[0.9] mt-6">Virtux<br />Arena Pass.</p>
              <p className="font-bebas text-3xl text-black/70 mt-2">Season 2026</p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase mt-6 text-white/90">Holder · Your name here</p>
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div className="font-mono text-[9px] leading-relaxed uppercase tracking-[0.15em] text-white/85">
                  PS5 · RTX · SIM · CINEMA<br />Ranaghat, West Bengal
                </div>
                <span className="font-script text-4xl text-black/70 leading-none">vx</span>
              </div>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[9px] tracking-[0.4em] uppercase text-white/70">Player</span>
            </div>
          </div>
        </div>

        {/* giant script running line */}
        <div className="absolute inset-x-0 bottom-10 pointer-events-none" style={{ opacity: seg(p, 0.3, 0.7) }}>
          <RunningLine speed={50} reverse>
            {["play", "eat", "chill", "repeat"].map((w) => (
              <span key={w} className="font-script text-[24vw] sm:text-[16vw] leading-[1.1] text-[#e10600] px-[3vw]">
                {w}
              </span>
            ))}
          </RunningLine>
        </div>
      </div>
    </section>
  );
};

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
          className="group shrink-0 w-[80vw] sm:w-[380px] rounded-3xl border border-white/10 hover:border-[#e10600] bg-[#0b0b0c] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] transition-colors"
        >
          <div>
            <div className="flex items-center justify-between">
              <StarRating rating={rev.rating} starClassName="w-3.5 h-3.5" />
              <span className="font-script text-6xl text-white/10 group-hover:text-[#e10600]/50 transition-colors leading-none">&ldquo;</span>
            </div>
            <p className="mt-3 text-white/80 leading-relaxed">{rev.comment}</p>
          </div>
          <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#e10600] flex items-center justify-center font-bebas text-lg text-white">{rev.avatarLetter}</div>
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
