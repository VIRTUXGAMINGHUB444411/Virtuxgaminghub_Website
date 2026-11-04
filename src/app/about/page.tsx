"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function AboutPage() {
  const { setIsBookingOpen } = useStore();

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest block mb-2">
            The Virtux Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-slate-900 leading-tight">
            Ranaghat&apos;s Premier <span className="text-[#f92f35]">Gaming Sanctuary</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 font-sans leading-relaxed">
            Born out of uncompromised passion for gaming, high frame-rates, and vibrant community. Built for comfort, speed, and unforgettable squad sessions.
          </p>
        </div>

        {/* Anti-Gambling Ethical Pledge Box */}
        <div className="p-6 sm:p-8 rounded-xl bg-red-50/70 border border-red-200 mb-16 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f92f35] text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
              🛡️
            </div>
            <div>
              <h3 className="font-orbitron font-black text-lg text-slate-900 mb-1.5">
                Ethical & Transparent Gaming Guarantee
              </h3>
              <p className="text-sm text-slate-700 font-sans leading-relaxed">
                At Virtux Gaming Hub, we <strong className="text-[#f92f35]">do not promote, support, or encourage gambling</strong> or any activity involving betting your hard-earned money. We operate strictly as a professional rental facility — providing gamers access to high-end PlayStation consoles, RTX 4090 PC rigs, and racing simulators at affordable, transparent hourly rates so everyone can enjoy gaming without prohibitive equipment costs.
              </p>
            </div>
          </div>
        </div>

        {/* Hardware & Arena Zones Breakdown */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
              State-of-the-Art Gear
            </span>
            <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-slate-900 mt-1">
              Engineered For <span className="text-[#f92f35]">Victory</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="editorial-card p-6 space-y-3">
              <div className="text-3xl">🎮</div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">Sony PlayStation 5 Arena</h3>
              <p className="text-xs text-[#f92f35] font-orbitron font-semibold">4K 120Hz Displays · DualSense Haptics</p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Dedicated PS5 stations running on low-lag gaming displays. Sanitized wireless DualSense controllers with adaptive triggers, Tempest 3D Audio headsets, and over 100 pre-installed games.
              </p>
            </div>

            <div className="editorial-card p-6 space-y-3">
              <div className="text-3xl">💻</div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">High-End RTX Battle Rigs</h3>
              <p className="text-xs text-[#f92f35] font-orbitron font-semibold">RTX 4090 / 4070 · 240Hz to 360Hz Monitors</p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Custom liquid-cooled beasts powered by NVIDIA GeForce RTX 3060, 4070, and flagship 4090 GPUs. Mechanical keyboards, esports mice with 8000Hz polling, and noise-isolating headsets.
              </p>
            </div>

            <div className="editorial-card p-6 space-y-3">
              <div className="text-3xl">🏎️</div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">Sim Racing Cockpit</h3>
              <p className="text-xs text-amber-600 font-orbitron font-semibold">Logitech G29 TrueForce Dual-Motor</p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Full force-feedback racing simulators with stainless steel paddle shifters, load-cell responsive pedals, and ergonomic sport racing bucket seats directly linked to PS5 and PC telemetry.
              </p>
            </div>

            <div className="editorial-card p-6 space-y-3">
              <div className="text-3xl">🎬</div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">Dolby Cinema Screening</h3>
              <p className="text-xs text-rose-600 font-orbitron font-semibold">150-inch 4K Laser · 7.2 Dolby Atmos</p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Watch web series and movies on Hotstar, Netflix, and Prime Video, or host live esports finals watch parties with your entire squad for just ₹40/hr (covers up to 3 people).
              </p>
            </div>

            <div className="editorial-card p-6 space-y-3">
              <div className="text-3xl">☕</div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">Gourmet Gamer Café</h3>
              <p className="text-xs text-emerald-600 font-orbitron font-semibold">Fresh Espresso, Mocktails & Hot Bites</p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                An artisan in-house kitchen serving hot espresso, cold brews, energy mocktails, loaded peri-peri fries, crispy chicken burgers, and molten lava cakes delivered directly to your station.
              </p>
            </div>

            <div className="editorial-card p-6 space-y-3">
              <div className="text-3xl">🏆</div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">Community Tournaments</h3>
              <p className="text-xs text-blue-600 font-orbitron font-semibold">Weekly FIFA, Tekken & Valorant Cups</p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Ranked weekly tournaments attracting competitive gamers from Ranaghat, Shantipur, and Krishnanagar with official cash prizes, live match casting, and championship leaderboard crowns.
              </p>
            </div>
          </div>
        </div>

        {/* Arena Amenities */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
              Unrivaled Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-slate-900 mt-1">
              Arena <span className="text-[#f92f35]">Amenities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="text-3xl">🚀</div>
              <h4 className="font-orbitron font-bold text-slate-900 text-base">Gigabit Fiber LAN</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Zero packet loss with redundant enterprise optical lines yielding under 10ms pings to game servers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="text-3xl">❄️</div>
              <h4 className="font-orbitron font-bold text-slate-900 text-base">21°C Climate Control</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Dual commercial chillers keep you and high-wattage GPUs running at peak comfort through long sessions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="text-3xl">⚡</div>
              <h4 className="font-orbitron font-bold text-slate-900 text-base">100% Power Backup</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Industrial online UPS coupled with a silent diesel generator ensures zero disconnections in ranked matches.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="text-3xl">🛡️</div>
              <h4 className="font-orbitron font-bold text-slate-900 text-base">Medical Grade Hygiene</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Every controller, mouse, keyboard, and headset is sanitized with antibacterial wipes between player sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Rules */}
        <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 mb-16 space-y-6">
          <h3 className="font-orbitron font-black text-xl text-slate-900 flex items-center gap-2">
            <span className="text-[#f92f35]">📋</span> Arena Guidelines & Fair Play
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-700 leading-relaxed">
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-rajdhani text-sm font-bold">Hardware Respect:</strong>
              DualSense controllers and mechanical keyboards are precision gear. Please handle all hardware with care. Any intentional physical damage will be billed to the player.
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-rajdhani text-sm font-bold">Session Tracking:</strong>
              Sessions are tracked accurately per minute. Overtime past booked hours is billed at just ₹2/min for PS5 and ₹1.5/min for PC.
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-rajdhani text-sm font-bold">Clean Desk Policy:</strong>
              Enjoy café food at your station! Please keep wet drinks in the provided cup holders to prevent spills on electronics.
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-rajdhani text-sm font-bold">Community Sportsmanship:</strong>
              Trash talk is part of competition, but toxic abuse, hate speech, or harassment towards staff or fellow gamers will lead to an immediate ban.
            </div>
          </div>
        </div>

        {/* Action Call */}
        <div className="text-center space-x-4">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="btn-red-action"
          >
            PLAY NOW
          </button>
          <Link href="/pricing" className="btn-white-action">
            Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
