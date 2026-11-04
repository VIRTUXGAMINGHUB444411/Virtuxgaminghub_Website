"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  PS5_NORMAL_RATES,
  PS5_EXTRA_CONTROLLER_RATES,
  PS5_SUBSCRIPTIONS,
  PS5_DUO_SUBSCRIPTIONS,
  PC_NORMAL_RATES,
  PC_SUBSCRIPTIONS,
  MOVIE_RATES,
  SIMULATOR_RATES,
  MEMBERSHIP_LIMITED_WEEKLY,
  MEMBERSHIP_LIMITED_MONTHLY,
  MEMBERSHIP_UNLIMITED,
  PRICING_RULES,
} from "@/data/pricingData";

export default function PricingPage() {
  const { setIsBookingOpen, setBookingServicePreset } = useStore();
  const [activeTab, setActiveTab] = useState<"ps5" | "pc" | "movie" | "sim" | "membership">("ps5");
  const [membershipType, setMembershipType] = useState<"limited" | "unlimited">("limited");

  // Interactive Live Calculator state
  const [calcStation, setCalcStation] = useState<"ps5" | "pc" | "sim" | "movie">("ps5");
  const [calcDuration, setCalcDuration] = useState<number>(2);
  const [calcControllers, setCalcControllers] = useState<number>(1);
  const [calcPeople, setCalcPeople] = useState<number>(2);

  let calculatedAmount = 0;
  if (calcStation === "ps5") {
    const base = calcDuration === 0.5 ? 80 : calcDuration === 1 ? 139 : calcDuration === 2 ? 239 : calcDuration === 3 ? 299 : calcDuration * 99;
    const extraCtrl = calcControllers > 1 ? (calcDuration === 0.5 ? 40 : calcDuration === 1 ? 59 : calcDuration === 2 ? 99 : calcDuration === 3 ? 119 : calcDuration * 40) : 0;
    calculatedAmount = base + extraCtrl;
  } else if (calcStation === "pc") {
    calculatedAmount = calcDuration === 0.5 ? 65 : calcDuration === 1 ? 119 : calcDuration === 2 ? 199 : calcDuration === 3 ? 239 : calcDuration * 80;
  } else if (calcStation === "sim") {
    calculatedAmount = calcDuration === 0.5 ? 70 : calcDuration === 1 ? 120 : calcDuration === 2 ? 210 : calcDuration === 3 ? 270 : calcDuration * 90;
  } else if (calcStation === "movie") {
    const base = calcDuration === 1 ? 40 : calcDuration === 2 ? 70 : calcDuration === 3 ? 100 : calcDuration * 35;
    const extraGuests = Math.max(0, calcPeople - 3) * 15;
    calculatedAmount = base + extraGuests;
  }

  const handleBookSelected = () => {
    const serviceName =
      calcStation === "ps5"
        ? "PlayStation 5 (Console + Controller)"
        : calcStation === "pc"
        ? "Gaming PC Battle Station (RTX Rigs)"
        : calcStation === "sim"
        ? "Racing Simulator (Logitech G29)"
        : "Dolby Cinema & OTT Suite";
    setBookingServicePreset(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">Pricing Plans</span>
        </div>

        {/* Page Hero */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest block mb-2">
            Transparent Rates · Zero Hidden Charges
          </span>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-slate-900 leading-tight">
            Gaming & Pass <span className="text-[#f92f35]">Pricing</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 font-sans leading-relaxed">
            Zero hidden charges. Pay per 30-minute block, session hours, or grab a transferable monthly pass for maximum savings across PS5, Gaming PCs, Motion Simulators, and Private Cinema.
          </p>
        </div>

        {/* Interactive Live Calculator HUD (Light Edition) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 mb-16 shadow-clean">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-orbitron font-black text-lg text-slate-900">
                Live Pricing & Session Calculator
              </h3>
              <p className="text-xs text-slate-500 font-rajdhani font-semibold">
                Configure your rig, select hours, and calculate exact checkout cost instantly
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-2">
                1. Select Rig
              </label>
              <select
                value={calcStation}
                onChange={(e) => setCalcStation(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
              >
                <option value="ps5">🎮 PlayStation 5 4K 120Hz</option>
                <option value="pc">💻 High-FPS Gaming PC Rig</option>
                <option value="sim">🏎️ Sim Racing Cockpit G29</option>
                <option value="movie">🎬 Dolby Cinema Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-2">
                2. Duration
              </label>
              <select
                value={calcDuration}
                onChange={(e) => setCalcDuration(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
              >
                <option value="0.5">30 Minutes (Quick Lap / Warmup)</option>
                <option value="1">1 Hour Session</option>
                <option value="2">2 Hours (Esports Grind)</option>
                <option value="3">3 Hours (Maximum Value Block)</option>
              </select>
            </div>

            {calcStation === "ps5" && (
              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-700 mb-2">
                  3. Controllers
                </label>
                <select
                  value={calcControllers}
                  onChange={(e) => setCalcControllers(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
                >
                  <option value="1">Single Player (1 DualSense)</option>
                  <option value="2">Multiplayer / Co-op (2 DualSense)</option>
                </select>
              </div>
            )}

            {calcStation === "movie" && (
              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-700 mb-2">
                  3. Total Guests
                </label>
                <select
                  value={calcPeople}
                  onChange={(e) => setCalcPeople(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
                >
                  <option value="2">1 to 3 People (Included in Base)</option>
                  <option value="4">4 People (+₹15 extra)</option>
                  <option value="5">5 People (+₹30 extra)</option>
                  <option value="6">6 People Squad (+₹45 extra)</option>
                </select>
              </div>
            )}

            <div>
              <div className="p-3 rounded-md bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-orbitron text-slate-400 block uppercase font-bold">
                    Total Rate
                  </span>
                  <span className="font-orbitron font-black text-2xl text-[#f92f35]">
                    ₹{calculatedAmount}/-
                  </span>
                </div>
                <button
                  onClick={handleBookSelected}
                  className="px-4 py-2 rounded bg-[#f92f35] hover:bg-[#e02228] text-white text-xs font-orbitron font-bold tracking-wider uppercase transition-colors shadow-xs"
                >
                  PLAY NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-200 mb-10">
          {[
            { id: "ps5", label: "🎮 PLAYSTATION 5" },
            { id: "pc", label: "💻 GAMING PC" },
            { id: "movie", label: "🎬 MOVIE" },
            { id: "sim", label: "🏎️ RACING SIMULATION" },
            { id: "membership", label: "👑 MEMBERSHIP" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-md font-orbitron text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-[#f92f35] text-white shadow-crimsonSm"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ TAB: PS5 ══════════ */}
        {activeTab === "ps5" && (
          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron font-black text-2xl text-slate-900">
                  Normal Session Rates
                </h3>
                <span className="text-xs font-rajdhani text-slate-500 font-bold">
                  {PRICING_RULES.overtime.ps5}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-red-50/70 border-l-4 border-[#f92f35] text-xs font-sans text-slate-700 mb-6">
                <strong className="text-[#f92f35] font-rajdhani font-bold mr-1">T&C*:</strong>
                The particular person who buys this normal session is only able to play; he/she cannot transfer the excess timing to anyone.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="editorial-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-wider">
                      Standard Console
                    </span>
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    PlayStation 5 (Console + Controller)
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    4K 120Hz HDR Gaming · Latest AAA Titles · DualSense Controller
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {PS5_NORMAL_RATES.map((rate, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded font-rajdhani ${
                          rate.highlight
                            ? "bg-red-50 border border-red-200 font-bold text-[#f92f35]"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">{rate.duration}</span>
                        <span className="font-orbitron font-black">₹{rate.price}/-</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 font-rajdhani pt-2 flex items-center gap-1.5 font-bold">
                    <span>⏱️</span>
                    <span>After time limit: <strong>₹2/- per minute</strong></span>
                  </div>
                </div>

                <div className="editorial-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-slate-700 uppercase tracking-wider">
                      Multiplayer Add-On
                    </span>
                    <span className="text-2xl">🕹️</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    Extra Controller Only
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    Add a 2nd / 3rd / 4th player for FIFA, WWE, Mortal Kombat & Co-op
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {PS5_EXTRA_CONTROLLER_RATES.map((rate, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded font-rajdhani ${
                          rate.highlight
                            ? "bg-slate-100 border border-slate-300 font-bold text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">{rate.duration}</span>
                        <span className="font-orbitron font-black">₹{rate.price}/-</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 font-rajdhani pt-2 flex items-center gap-1.5 font-bold">
                    <span>⏱️</span>
                    <span>After time limit: <strong>₹1/- per minute</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriptions */}
            <div>
              <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-3">
                Hour Basis Subscriptions (30 Days Validity)
              </h3>
              <div className="p-3.5 rounded-lg bg-emerald-50 border-l-4 border-emerald-500 text-xs font-sans text-slate-700 mb-6">
                <strong className="text-emerald-700 font-rajdhani font-bold mr-1">T&C*:</strong>
                Valid for only one month (billed for 30 days). If a particular person buys this subscription, <strong className="text-emerald-800">they can split this with their friends</strong> — meaning he/she can transfer excess hours to anyone.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="editorial-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-wider">
                      Shareable Pack
                    </span>
                    <span className="text-2xl">👑</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    PS5 Monthly Hours Pack (Single Controller)
                  </h4>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {PS5_SUBSCRIPTIONS.map((pack, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded font-rajdhani ${
                          pack.highlight
                            ? "bg-red-50 border border-red-200 font-bold text-[#f92f35]"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">Total {pack.hours} hrs</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs line-through text-slate-400">₹{pack.oldPrice}/-</span>
                          <span className="font-orbitron font-black">₹{pack.price}/-</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorial-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-slate-800 uppercase tracking-wider">
                      Duo & Squad Pack
                    </span>
                    <span className="text-2xl">👥</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    PS5 + 1 Extra Controller Pack (2 Controllers)
                  </h4>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {PS5_DUO_SUBSCRIPTIONS.map((pack, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded font-rajdhani ${
                          pack.highlight
                            ? "bg-slate-100 border border-slate-300 font-bold text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">Total {pack.hours} hrs</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs line-through text-slate-400">₹{pack.oldPrice}/-</span>
                          <span className="font-orbitron font-black">₹{pack.price}/-</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: PC ══════════ */}
        {activeTab === "pc" && (
          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron font-black text-2xl text-slate-900">
                  Normal PC Session Rates
                </h3>
                <span className="text-xs font-rajdhani text-slate-500 font-bold">
                  {PRICING_RULES.overtime.pc}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-red-50/70 border-l-4 border-[#f92f35] text-xs font-sans text-slate-700 mb-6">
                <strong className="text-[#f92f35] font-rajdhani font-bold mr-1">T&C*:</strong>
                The particular person who buys this normal session is only able to play; he/she cannot transfer the excess timing to anyone.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="editorial-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-wider">
                      Esports Ready
                    </span>
                    <span className="text-2xl">💻</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    Gaming PC – Standard Session
                  </h4>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {PC_NORMAL_RATES.map((rate, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded font-rajdhani ${
                          rate.highlight
                            ? "bg-red-50 border border-red-200 font-bold text-[#f92f35]"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">{rate.duration}</span>
                        <span className="font-orbitron font-black">₹{rate.price}/-</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 font-rajdhani pt-2 flex items-center gap-1.5 font-bold">
                    <span>⏱️</span>
                    <span>After time limit: <strong>₹1.5/- per minute</strong></span>
                  </div>
                </div>

                <div className="editorial-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-slate-800 uppercase tracking-wider">
                      Loaded Features
                    </span>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    What&apos;s Included with PC
                  </h4>
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-rajdhani font-semibold">
                    <div className="flex justify-between text-slate-600">
                      <span>Popular Games</span>
                      <span className="text-slate-900 font-bold">Valorant, CS2, GTA V, Apex</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Peripherals</span>
                      <span className="text-slate-900 font-bold">Mechanical Switch KB + Pro Mouse</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Audio</span>
                      <span className="text-slate-900 font-bold">Noise-isolating 7.1 Studio Headset</span>
                    </div>
                    <div className="flex justify-between text-[#f92f35] font-bold">
                      <span>High-Speed Network</span>
                      <span>Ultra-low Ping Optical Gaming LAN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriptions */}
            <div>
              <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-3">
                Gaming PC Hour Packs (30 Days Validity)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="editorial-card p-6 space-y-4">
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    PC Monthly Hours Pack
                  </h4>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {PC_SUBSCRIPTIONS.map((pack, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded font-rajdhani ${
                          pack.highlight
                            ? "bg-red-50 border border-red-200 font-bold text-[#f92f35]"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="font-semibold">Total {pack.hours} hrs</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs line-through text-slate-400">₹{pack.oldPrice}/-</span>
                          <span className="font-orbitron font-black">₹{pack.price}/-</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorial-card p-6 space-y-4">
                  <h4 className="font-orbitron font-bold text-lg text-slate-900">
                    Why Choose PC Packs?
                  </h4>
                  <div className="space-y-3 pt-2 border-t border-slate-100 text-xs font-rajdhani font-bold">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Squad Sharing</span>
                      <span className="text-[#f92f35]">Transfer / Split with Friends</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Savings</span>
                      <span className="text-emerald-700">Save up to ₹4,300/-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Validity</span>
                      <span className="text-slate-800">Full 30 Days (1 Month)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: MOVIE ══════════ */}
        {activeTab === "movie" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="editorial-card p-8 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-wider">
                  Cinema & OTT Suite
                </span>
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="font-orbitron font-black text-2xl text-slate-900">
                OTT Subscription Watch (Any OTT)
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Hotstar, Netflix, Prime Video & more · Giant 150″ 4K Projection · 7.2 Channel Dolby Atmos Surround
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                {MOVIE_RATES.map((rate, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3.5 rounded font-rajdhani ${
                      rate.highlight
                        ? "bg-red-50 border border-red-200 font-bold text-[#f92f35]"
                        : "text-slate-800 bg-slate-50"
                    }`}
                  >
                    <span className="text-base font-semibold">{rate.duration}</span>
                    <span className="font-orbitron font-black text-lg">₹{rate.price}/-</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded bg-slate-100 text-xs text-slate-700 font-sans">
                👥 <strong>{PRICING_RULES.movieRules}</strong>
              </div>

              <button
                onClick={() => {
                  setBookingServicePreset("Dolby Cinema & OTT Suite");
                  setIsBookingOpen(true);
                }}
                className="w-full py-3.5 rounded bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-crimsonSm"
              >
                PLAY NOW · Reserve Cinema Suite 🍿
              </button>
            </div>
          </div>
        )}

        {/* ══════════ TAB: SIMULATOR ══════════ */}
        {activeTab === "sim" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="editorial-card p-8 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-wider">
                  Force Feedback Cockpit
                </span>
                <span className="text-3xl">🏎️</span>
              </div>
              <h3 className="font-orbitron font-black text-2xl text-slate-900">
                Racing Simulator Rig
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Logitech G29 TrueForce Dual-Motor · Load-Cell 3 Pedals · Sequential Shifter · PS5 & PC Telemetry Linked
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                {SIMULATOR_RATES.map((rate, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3.5 rounded font-rajdhani ${
                      rate.highlight
                        ? "bg-red-50 border border-red-200 font-bold text-[#f92f35]"
                        : "text-slate-800 bg-slate-50"
                    }`}
                  >
                    <span className="text-base font-semibold">{rate.duration}</span>
                    <span className="font-orbitron font-black text-lg">₹{rate.price}/-</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setBookingServicePreset("Racing Simulator (Logitech G29)");
                  setIsBookingOpen(true);
                }}
                className="w-full py-3.5 rounded bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-crimsonSm"
              >
                PLAY NOW · Book Racing Cockpit 🏎️
              </button>
            </div>
          </div>
        )}

        {/* ══════════ TAB: MEMBERSHIP ══════════ */}
        {activeTab === "membership" && (
          <div className="space-y-10">
            <div className="flex justify-center">
              <div className="inline-flex p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setMembershipType("limited")}
                  className={`px-6 py-2.5 rounded-md font-orbitron text-xs font-bold uppercase transition-all ${
                    membershipType === "limited"
                      ? "bg-[#f92f35] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⏳ LIMITED PASSES
                </button>
                <button
                  onClick={() => setMembershipType("unlimited")}
                  className={`px-6 py-2.5 rounded-md font-orbitron text-xs font-bold uppercase transition-all ${
                    membershipType === "unlimited"
                      ? "bg-[#f92f35] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ♾️ UNLIMITED PASSES
                </button>
              </div>
            </div>

            {membershipType === "limited" ? (
              <div className="space-y-12">
                <div>
                  <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-2">
                    Weekly Limited Membership (7 Days)
                  </h3>
                  <div className="p-3.5 rounded-lg bg-red-50/70 border-l-4 border-[#f92f35] text-xs text-slate-700 mb-6 font-sans">
                    <strong>T&C*:</strong> Transferable membership. Includes <strong>5% discount on all café food items</strong>.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="editorial-card p-5 space-y-3">
                      <h4 className="font-orbitron font-bold text-sm text-[#f92f35]">
                        🎮 PS5 (Console + Controller)
                      </h4>
                      <div className="space-y-2 text-xs font-rajdhani font-semibold">
                        {MEMBERSHIP_LIMITED_WEEKLY.ps5.map((row, i) => (
                          <div key={i} className="flex justify-between p-2 rounded bg-slate-50">
                            <span>{row.hoursPerDay} hr/day ({row.totalHours}h)</span>
                            <span className="font-orbitron font-black text-slate-900">₹{row.price}/-</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="editorial-card p-5 space-y-3">
                      <h4 className="font-orbitron font-bold text-sm text-slate-800">
                        🕹️ PS5 + 1 Controller
                      </h4>
                      <div className="space-y-2 text-xs font-rajdhani font-semibold">
                        {MEMBERSHIP_LIMITED_WEEKLY.ps5Duo.map((row, i) => (
                          <div key={i} className="flex justify-between p-2 rounded bg-slate-50">
                            <span>{row.hoursPerDay} hr/day ({row.totalHours}h)</span>
                            <span className="font-orbitron font-black text-slate-900">₹{row.price}/-</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="editorial-card p-5 space-y-3">
                      <h4 className="font-orbitron font-bold text-sm text-slate-800">
                        💻 Gaming PC Rigs
                      </h4>
                      <div className="space-y-2 text-xs font-rajdhani font-semibold">
                        {MEMBERSHIP_LIMITED_WEEKLY.pc.map((row, i) => (
                          <div key={i} className="flex justify-between p-2 rounded bg-slate-50">
                            <span>{row.hoursPerDay} hr/day ({row.totalHours}h)</span>
                            <span className="font-orbitron font-black text-slate-900">₹{row.price}/-</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-2">
                    Monthly Limited Membership (30 Days)
                  </h3>
                  <div className="p-3.5 rounded-lg bg-red-50/70 border-l-4 border-[#f92f35] text-xs text-slate-700 mb-6 font-sans">
                    <strong>T&C*:</strong> Transferable membership. Includes <strong>10% discount on all café food items</strong>.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="editorial-card p-5 space-y-3">
                      <h4 className="font-orbitron font-bold text-sm text-[#f92f35]">
                        🎮 PS5 (Console + Controller)
                      </h4>
                      <div className="space-y-2 text-xs font-rajdhani font-semibold">
                        {MEMBERSHIP_LIMITED_MONTHLY.ps5.map((row, i) => (
                          <div key={i} className="flex justify-between p-2 rounded bg-slate-50">
                            <span>{row.hoursPerDay} hr/day ({row.totalHours}h)</span>
                            <span className="font-orbitron font-black text-slate-900">₹{row.price}/-</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="editorial-card p-5 space-y-3">
                      <h4 className="font-orbitron font-bold text-sm text-slate-800">
                        🕹️ PS5 + 1 Controller
                      </h4>
                      <div className="space-y-2 text-xs font-rajdhani font-semibold">
                        {MEMBERSHIP_LIMITED_MONTHLY.ps5Duo.map((row, i) => (
                          <div key={i} className="flex justify-between p-2 rounded bg-slate-50">
                            <span>{row.hoursPerDay} hr/day ({row.totalHours}h)</span>
                            <span className="font-orbitron font-black text-slate-900">₹{row.price}/-</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="editorial-card p-5 space-y-3">
                      <h4 className="font-orbitron font-bold text-sm text-slate-800">
                        💻 Gaming PC Rigs
                      </h4>
                      <div className="space-y-2 text-xs font-rajdhani font-semibold">
                        {MEMBERSHIP_LIMITED_MONTHLY.pc.map((row, i) => (
                          <div key={i} className="flex justify-between p-2 rounded bg-slate-50">
                            <span>{row.hoursPerDay} hr/day ({row.totalHours}h)</span>
                            <span className="font-orbitron font-black text-slate-900">₹{row.price}/-</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div>
                  <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-2">
                    Weekly Unlimited Pass (7 Days)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="editorial-card p-6 space-y-3">
                      <span className="text-2xl">🎮</span>
                      <h4 className="font-orbitron font-bold text-base text-slate-900">PS5 Console</h4>
                      <div className="font-orbitron font-black text-3xl text-[#f92f35]">
                        ₹{MEMBERSHIP_UNLIMITED.weekly.ps5}/-
                      </div>
                      <span className="text-xs text-slate-500 font-rajdhani font-semibold block">7 Days Unlimited Access</span>
                    </div>

                    <div className="editorial-card p-6 space-y-3">
                      <span className="text-2xl">🕹️</span>
                      <h4 className="font-orbitron font-bold text-base text-slate-900">PS5 + 1 Controller</h4>
                      <div className="font-orbitron font-black text-3xl text-slate-900">
                        ₹{MEMBERSHIP_UNLIMITED.weekly.ps5Duo}/-
                      </div>
                      <span className="text-xs text-slate-500 font-rajdhani font-semibold block">Dual Player Unlimited 7 Days</span>
                    </div>

                    <div className="editorial-card p-6 space-y-3">
                      <span className="text-2xl">💻</span>
                      <h4 className="font-orbitron font-bold text-base text-slate-900">Gaming PC Rig</h4>
                      <div className="font-orbitron font-black text-3xl text-slate-900">
                        ₹{MEMBERSHIP_UNLIMITED.weekly.pc}/-
                      </div>
                      <span className="text-xs text-slate-500 font-rajdhani font-semibold block">7 Days Unlimited PC</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-2">
                    Monthly Unlimited Pass (30 Days)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="editorial-card p-6 space-y-3 border-red-200 bg-red-50/30">
                      <h4 className="font-orbitron font-bold text-base text-slate-900">PS5 Unlimited 30 Days</h4>
                      <div className="font-orbitron font-black text-3xl text-[#f92f35]">
                        ₹{MEMBERSHIP_UNLIMITED.monthly.ps5}/-
                      </div>
                      <span className="text-xs text-slate-600 font-rajdhani font-bold block">30 Days + Free Daily Drink</span>
                    </div>

                    <div className="editorial-card p-6 space-y-3">
                      <h4 className="font-orbitron font-bold text-base text-slate-900">PS5 + Extra Controller</h4>
                      <div className="font-orbitron font-black text-3xl text-slate-900">
                        ₹{MEMBERSHIP_UNLIMITED.monthly.ps5Duo}/-
                      </div>
                      <span className="text-xs text-slate-500 font-rajdhani font-semibold block">Dual Player 30 Days + Free Drink</span>
                    </div>

                    <div className="editorial-card p-6 space-y-3">
                      <h4 className="font-orbitron font-bold text-base text-slate-900">Gaming PC Unlimited</h4>
                      <div className="font-orbitron font-black text-3xl text-slate-900">
                        ₹{MEMBERSHIP_UNLIMITED.monthly.pc}/-
                      </div>
                      <span className="text-xs text-slate-500 font-rajdhani font-semibold block">30 Days PC + Free Drink</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
