"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { GAMES_DATA } from "@/data/gamesData";

export default function HomePage() {
  const { stations, setIsBookingOpen, setBookingServicePreset, reviews } = useStore();
  const [gameFilter, setGameFilter] = useState<"all" | "ps5" | "pc" | "sim">("all");
  const [activeSlide, setActiveSlide] = useState(1);

  const availableStationsCount = stations.filter((s) => s.status === "Available").length;

  const filteredGames = GAMES_DATA.filter((g) => {
    if (gameFilter === "all") return true;
    return g.category === gameFilter || g.category === "all";
  });

  const handleQuickBook = (preset: string) => {
    setBookingServicePreset(preset);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative overflow-hidden bg-white text-slate-900">
      {/* ═══════════════════════════ HERO SECTION (Sekiro Editorial Split Style) ═══════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-slate-200">
        {/* Left Angular Masked Action Background */}
        <div
          className="absolute inset-y-0 left-0 w-full lg:w-[65%] z-0 clip-diagonal-right bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(249,47,53,0.35) 100%)`,
          }}
        >
          {/* Subtle Ambient Embers */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(249,47,53,0.25),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Large Stylized Background Watermark */}
          <div className="absolute top-1/2 left-8 -translate-y-1/2 select-none pointer-events-none opacity-10">
            <span className="font-orbitron font-black text-[18vw] text-white leading-none tracking-tighter">
              VIRTUX
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column (Over Action Background): Giant Title & Trailer HUD */}
            <div className="lg:col-span-7 text-white flex flex-col justify-between space-y-8 pr-0 lg:pr-8">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-black/60 border border-white/20 text-xs font-rajdhani font-bold tracking-widest uppercase self-start backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#f92f35] animate-ping" />
                <span>Ranaghat&apos;s First Premium Gaming Hub</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-white leading-none">
                  VIRTUX
                </h1>
                <p className="font-orbitron text-xl sm:text-2xl font-bold tracking-[0.2em] text-red-400 mt-2">
                  PLAY · EAT · CHILL
                </p>
              </div>

              {/* Video Trailer Thumbnail & Numbered Rail (Directly matching Sekiro Reference) */}
              <div className="flex items-center gap-6 pt-4">
                {/* Left Numbered Vertical Indicator */}
                <div className="flex flex-col items-center justify-center border border-white/20 bg-black/50 backdrop-blur-md px-3.5 py-3 rounded text-center">
                  <span className="font-orbitron font-black text-2xl text-white">0{activeSlide}</span>
                  <div className="flex flex-col gap-1 mt-2 text-slate-400">
                    <button
                      onClick={() => setActiveSlide((s) => (s > 1 ? s - 1 : 3))}
                      className="hover:text-white transition-colors"
                      title="Previous"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => setActiveSlide((s) => (s < 3 ? s + 1 : 1))}
                      className="hover:text-white transition-colors"
                      title="Next"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Floating Interactive Video / Arena Showcase Thumbnail */}
                <div
                  onClick={() => handleQuickBook("PlayStation 5 (Console + Controller)")}
                  className="relative group cursor-pointer overflow-hidden rounded-md border border-white/25 bg-slate-900 w-64 sm:w-80 h-32 sm:h-36 shadow-2xl flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 to-black/80 group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Play Button */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#f92f35] group-hover:text-white transition-all">
                    <svg className="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  <div className="absolute bottom-2 left-3 z-10">
                    <span className="text-[11px] font-orbitron font-bold text-white block">
                      {activeSlide === 1 ? "4K 120Hz PS5 Arena" : activeSlide === 2 ? "360Hz RTX Battle Rig" : "Motion Sim Cockpit"}
                    </span>
                    <span className="text-[10px] font-rajdhani text-red-300">Tap to Quick Reserve Station</span>
                  </div>
                </div>
              </div>

              {/* Story text */}
              <p className="max-w-xl text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Carve your own clever path to victory in Ranaghat&apos;s all-in-one entertainment sanctuary. Featuring liquid-cooled RTX battle stations, PlayStation 5 consoles, force-feedback simulators, and private Dolby Cinema screening.
              </p>
            </div>

            {/* Right Column (Crisp Light Editorial Side): Sekiro Game Cover & Floating Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:pl-10">
              
              {/* Top Floating Product / Station Pass Card */}
              <div className="flex items-start justify-end gap-5">
                <div className="text-right">
                  <span className="font-orbitron font-black text-2xl sm:text-3xl text-slate-900 block">
                    ₹139/-
                  </span>
                  <span className="text-xs font-rajdhani text-slate-500 font-semibold block uppercase">
                    PS5 · PC · SIMULATOR
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                    Starting from ₹65 for 30m
                  </span>
                </div>

                {/* Floating Game Case / Pass Box Art */}
                <div className="w-24 sm:w-28 rounded-md overflow-hidden shadow-2xl border-2 border-slate-200 bg-slate-900 transform hover:-rotate-2 transition-transform duration-300 shrink-0">
                  <div className="bg-[#003791] text-white text-[9px] font-bold text-center py-0.5 font-sans tracking-wider">
                    PS5 & PC PASS
                  </div>
                  <div className="h-28 bg-gradient-to-b from-slate-800 to-black p-2 flex flex-col justify-between text-center">
                    <span className="text-2xl mt-1">🎮</span>
                    <div>
                      <span className="font-orbitron font-black text-[11px] text-white block">VIRTUX</span>
                      <span className="text-[9px] text-[#f92f35] font-bold">GAME PASS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Laurel Wreath Award Badge (Exactly as reference image) */}
              <div className="flex items-center justify-end gap-3 self-end">
                <span className="text-3xl text-amber-500">🏆</span>
                <div className="text-right">
                  <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest block">
                    RANAGHAT OFFICIAL SELECTION
                  </span>
                  <span className="font-orbitron font-black text-sm text-slate-900 tracking-wider">
                    PREMIER GAMING AWARDS
                  </span>
                </div>
              </div>

              {/* Sekiro Style PLAY NOW Big Crimson Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                <Link
                  href="/pricing"
                  className="btn-white-action text-center"
                >
                  View Pricing
                </Link>

                <button
                  onClick={() => handleQuickBook("PlayStation 5 (Console + Controller)")}
                  className="btn-red-action text-center text-sm"
                >
                  PLAY NOW
                </button>
              </div>

              {/* Live telemetry status */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-rajdhani">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800">
                    Live Arena: <strong className="text-emerald-600 font-orbitron">{availableStationsCount} of {stations.length}</strong> Available
                  </span>
                </div>
                <span className="text-slate-500 font-semibold">Open Daily 10 AM – 9:30 PM</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ LIVE ARENA OCCUPANCY MATRIX (Light Style) ═══════════════════════════ */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
                Real-Time Station Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-slate-900 mt-1">
                Live Arena <span className="text-[#f92f35]">Occupancy</span>
              </h2>
            </div>
            <Link
              href="/pricing"
              className="text-xs font-rajdhani font-bold text-[#f92f35] hover:text-[#e02228] flex items-center gap-1.5"
            >
              <span>See Full Hourly Rates & Day Passes</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {stations.map((st) => (
              <div
                key={st.id}
                onClick={() => handleQuickBook(st.name)}
                className={`p-4 rounded-lg border transition-all cursor-pointer group bg-white shadow-xs hover:shadow-md ${
                  st.status === "Available"
                    ? "border-emerald-200 hover:border-emerald-500"
                    : st.status === "Reserved"
                    ? "border-amber-200 hover:border-amber-500"
                    : "border-red-200 hover:border-red-500"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">
                    {st.category === "ps5"
                      ? "🎮"
                      : st.category === "pc"
                      ? "💻"
                      : st.category === "sim"
                      ? "🏎️"
                      : "🎬"}
                  </span>
                  <span
                    className={`text-[9px] font-orbitron font-bold px-2 py-0.5 rounded ${
                      st.status === "Available"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : st.status === "Reserved"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {st.status}
                  </span>
                </div>

                <h4 className="font-orbitron font-bold text-xs text-slate-900 truncate">
                  {st.name}
                </h4>

                <p className="text-[11px] font-rajdhani text-slate-500 mt-1 truncate">
                  {st.status === "In-Use"
                    ? `${st.game || "In Match"} (${st.timeRemaining || "Active"})`
                    : st.status === "Reserved"
                    ? "Slot Reserved"
                    : "Ready to Play"}
                </p>

                <div className="mt-2 text-[10px] font-orbitron font-bold text-[#f92f35] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span>Reserve Station</span>
                  <span>+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ EXPERIENCE ZONES (Clean Light Cards) ═══════════════════════════ */}
      <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
              Engineered For Immersion
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-black text-slate-900 mt-2">
              Arena Experience <span className="text-[#f92f35]">Zones</span>
            </h2>
            <p className="text-sm text-slate-600 font-sans mt-3">
              Six dedicated gaming environments tailored for casual fun, tournament ranked grinds, high-octane racing, and gourmet relaxation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Zone 1: PS5 */}
            <div className="editorial-card p-6 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-2xl mb-5 text-[#f92f35]">
                  🎮
                </div>
                <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-1.5">
                  Console Arena (PS5)
                </h3>
                <p className="text-xs font-orbitron text-[#f92f35] font-semibold mb-3">
                  Starting at ₹80 / 30 mins · 4K 120Hz Displays
                </p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Dedicated PlayStation 5 stations with ultra-low input lag HDR gaming displays, sanitized DualSense haptic controllers, and a complete library of 100+ titles including EA FC 25, Tekken 8, and Spider-Man 2.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleQuickBook("PlayStation 5 (Console + Controller)")}
                  className="text-xs font-orbitron font-bold text-[#f92f35] hover:text-[#e02228]"
                >
                  Book PS5 Pod →
                </button>
                <span className="text-xs font-rajdhani text-slate-400 font-bold">6 Pods Online</span>
              </div>
            </div>

            {/* Zone 2: PC Battle Rigs */}
            <div className="editorial-card p-6 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl mb-5 text-slate-800">
                  💻
                </div>
                <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-1.5">
                  RTX Battle Stations
                </h3>
                <p className="text-xs font-orbitron text-[#f92f35] font-semibold mb-3">
                  Starting at ₹65 / 30 mins · 240Hz to 360Hz Monitors
                </p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Liquid-cooled gaming PCs powered by NVIDIA GeForce RTX 3060, 4070, and flagship 4090 GPUs. Mechanical keyboards, studio headsets, and zero-jitter optical fiber LAN tuned for Valorant and CS2.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleQuickBook("Gaming PC Battle Station (RTX Rigs)")}
                  className="text-xs font-orbitron font-bold text-[#f92f35] hover:text-[#e02228]"
                >
                  Book PC Rig →
                </button>
                <span className="text-xs font-rajdhani text-slate-400 font-bold">Sub-10ms Ping</span>
              </div>
            </div>

            {/* Zone 3: Racing Simulator */}
            <div className="editorial-card p-6 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl mb-5 text-amber-600">
                  🏎️
                </div>
                <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-1.5">
                  Motion Sim Cockpit
                </h3>
                <p className="text-xs font-orbitron text-amber-600 font-semibold mb-3">
                  Starting at ₹70 / 30 mins · Logitech G29 Force Feedback
                </p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Experience authentic racing physics with dual-motor force feedback, responsive load-cell pedals, and full bucket seating. Master Gran Turismo 7, F1 23, and Forza Horizon 5.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleQuickBook("Racing Simulator (Logitech G29)")}
                  className="text-xs font-orbitron font-bold text-amber-600 hover:text-amber-700"
                >
                  Book Cockpit →
                </button>
                <span className="text-xs font-rajdhani text-slate-400 font-bold">GT7 & F1 Ready</span>
              </div>
            </div>

            {/* Zone 4: Dolby Cinema */}
            <div className="editorial-card p-6 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl mb-5 text-rose-600">
                  🎬
                </div>
                <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-1.5">
                  Private Dolby Cinema
                </h3>
                <p className="text-xs font-orbitron text-rose-600 font-semibold mb-3">
                  Starting at ₹40 / 1 hr (Up to 3 guests included)
                </p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Giant 150-inch 4K laser projection with 7.2 Dolby Atmos surround audio. Perfect for private OTT watch parties (Netflix, Prime, Hotstar), anime marathons, and live tournament screenings.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleQuickBook("Dolby Cinema & OTT Suite")}
                  className="text-xs font-orbitron font-bold text-rose-600 hover:text-rose-700"
                >
                  Book Cinema Suite →
                </button>
                <span className="text-xs font-rajdhani text-slate-400 font-bold">Squad Suite</span>
              </div>
            </div>

            {/* Zone 5: Gamer Café */}
            <div className="editorial-card p-6 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mb-5 text-emerald-600">
                  ☕
                </div>
                <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-1.5">
                  Virtux Café & Bites
                </h3>
                <p className="text-xs font-orbitron text-emerald-600 font-semibold mb-3">
                  Artisan Coffee, Monster Cans & Hot Bites
                </p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Fuel up without leaving your station. Enjoy fresh espresso, chilled blue mocktails, loaded peri-peri fries, crispy chicken burgers, and molten lava cakes delivered directly to your desk.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link href="/cafe" className="text-xs font-orbitron font-bold text-emerald-600 hover:text-emerald-700">
                  Order Food Online →
                </Link>
                <span className="text-xs font-rajdhani text-slate-400 font-bold">In-Seat Delivery</span>
              </div>
            </div>

            {/* Zone 6: Esports & Community */}
            <div className="editorial-card p-6 sm:p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl mb-5 text-blue-600">
                  🏆
                </div>
                <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-1.5">
                  Esports & Cash Cups
                </h3>
                <p className="text-xs font-orbitron text-blue-600 font-semibold mb-3">
                  Weekly Tournaments · Real Cash Prizes
                </p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Join Ranaghat&apos;s most competitive esports brackets. Weekly FIFA / EA FC cups, Tekken 8 showdowns, and Valorant LAN battles with official live standings and championship trophies.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link href="/contact" className="text-xs font-orbitron font-bold text-blue-600 hover:text-blue-700">
                  Register for Next Cup →
                </Link>
                <span className="text-xs font-rajdhani text-slate-400 font-bold">Open to All</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED GAMES ═══════════════════════════ */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
                Installed & Ready to Launch
              </span>
              <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-slate-900 mt-1">
                Featured <span className="text-[#f92f35]">AAA Titles</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-md bg-white border border-slate-200 shadow-xs">
              {(["all", "ps5", "pc", "sim"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGameFilter(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold uppercase transition-all ${
                    gameFilter === cat
                      ? "bg-[#f92f35] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat === "all" ? "All" : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.slice(0, 8).map((game) => (
              <div
                key={game.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-[#f92f35] transition-all hover:shadow-lg"
              >
                {/* Visual Cover Gradient */}
                <div
                  className={`h-40 bg-gradient-to-br ${game.coverGradient} relative p-4 flex flex-col justify-between text-white`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl filter drop-shadow-md">{game.icon}</span>
                    {game.badge && (
                      <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-black/60 border border-white/20 text-white backdrop-blur-md">
                        {game.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-red-300">
                      {game.genre}
                    </span>
                    <h4 className="font-orbitron font-bold text-lg text-white group-hover:text-red-200 transition-colors">
                      {game.title}
                    </h4>
                  </div>
                </div>

                {/* Specs HUD */}
                <div className="p-4 space-y-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-rajdhani">
                    <span className="text-slate-500 font-semibold">Display Quality</span>
                    <span className="text-slate-800 font-bold">{game.resolution}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-rajdhani">
                    <span className="text-slate-500 font-semibold">Framerate</span>
                    <span className="text-emerald-600 font-orbitron font-bold">{game.framerate}</span>
                  </div>
                  <button
                    onClick={() => handleQuickBook(game.title)}
                    className="w-full mt-2 py-2 rounded bg-slate-100 border border-slate-200 text-xs font-orbitron font-bold text-slate-800 hover:bg-[#f92f35] hover:text-white hover:border-[#f92f35] transition-all"
                  >
                    Play This Title ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ VERIFIED REVIEWS ═══════════════════════════ */}
      <section className="py-20 relative bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
              Community Voice
            </span>
            <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-slate-900 mt-2">
              Verified <span className="text-[#f92f35]">Gamer Reviews</span>
            </h2>
            <p className="text-sm text-slate-600 font-sans mt-3">
              Hear what champions and squads from Ranaghat say about their sessions at Virtux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="editorial-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-sm mb-3">
                    {"★".repeat(rev.rating)}
                  </div>
                  <p className="text-xs text-slate-700 font-sans italic leading-relaxed mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center font-orbitron font-bold text-xs text-[#f92f35]">
                    {rev.avatarLetter}
                  </div>
                  <div>
                    <h5 className="font-rajdhani font-bold text-sm text-slate-900">
                      {rev.name}
                    </h5>
                    <span className="text-[11px] font-rajdhani text-[#f92f35] font-semibold block -mt-0.5">
                      {rev.service}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/feedback"
              className="btn-white-action"
            >
              <span>⭐ Leave Your Review or View All</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SEKIRO STYLE BOTTOM CTA BANNER ═══════════════════════════ */}
      <section className="py-16 relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,47,53,0.25),transparent_60%)]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-orbitron font-bold text-red-400 uppercase tracking-widest block mb-2">
            Sanctuary For Gamers
          </span>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-white mb-4">
            READY TO TAKE YOUR <span className="text-[#f92f35]">SEAT?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed mb-8">
            Experience Ranaghat&apos;s premier gaming pods, force-feedback motion simulators, and in-seat gourmet café. Reserve your spot or walk into the hub today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleQuickBook("PlayStation 5 (Console + Controller)")}
              className="btn-red-action text-sm"
            >
              PLAY NOW
            </button>
            <Link href="/contact" className="btn-white-action">
              Find Our Location
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
