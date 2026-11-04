"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GALLERY_ITEMS, GalleryItem } from "@/data/galleryData";
import { useStore } from "@/context/StoreContext";

export default function GalleryPage() {
  const { setIsBookingOpen } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">Arena Gallery</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest block mb-2">
            Arena Walkthrough & Pods
          </span>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-slate-900 leading-tight">
            The <span className="text-[#f92f35]">Experience Zones</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 font-sans leading-relaxed">
            Designed with ambient illumination, noise-isolated pods, ergonomic racing recliners, and tournament-grade gaming setups.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-200 mb-10">
          {[
            { id: "all", label: "All Zones" },
            { id: "ps5", label: "🎮 PS5 Pods" },
            { id: "pc", label: "💻 RTX Battle Stations" },
            { id: "sim", label: "🏎️ Sim Racing" },
            { id: "cinema", label: "🎬 Dolby Cinema" },
            { id: "cafe", label: "☕ Café Lounge" },
            { id: "events", label: "🏆 Esports Stage" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-md font-orbitron text-xs font-bold uppercase tracking-wider transition-all ${
                selectedFilter === tab.id
                  ? "bg-[#f92f35] text-white shadow-crimsonSm"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="editorial-card overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Virtual Visual Banner */}
              <div
                className={`h-52 bg-gradient-to-br ${item.bgGradient} p-6 flex flex-col justify-between relative overflow-hidden text-white`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl filter drop-shadow-md">{item.icon}</span>
                  <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md">
                    {item.categoryLabel}
                  </span>
                </div>

                <div>
                  <h3 className="font-orbitron font-black text-xl text-white group-hover:text-red-200 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-rajdhani text-red-300 font-semibold block mt-1">
                    {item.tagline}
                  </span>
                </div>
              </div>

              {/* Specs & Description */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-rajdhani text-slate-500 font-semibold">
                    <strong className="text-[#f92f35] block font-orbitron text-[10px] mb-0.5">
                      EQUIPMENT SPECIFICATIONS
                    </strong>
                    {item.specs}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-orbitron font-bold text-[#f92f35] group-hover:text-[#e02228] transition-colors">
                  <span>Inspect Zone Details</span>
                  <span>🔍</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hub Specifications Banner */}
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
              Uncompromising Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-orbitron font-black text-slate-900 mt-1">
              Arena Core <span className="text-[#f92f35]">Specifications</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <span className="text-2xl">🚀</span>
              <h4 className="font-orbitron font-bold text-slate-900 text-sm">Gigabit Fiber Internet</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Zero jitter, ultra-low ping under 10ms to all Indian & SEA game servers with redundant enterprise optical connections.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <span className="text-2xl">❄️</span>
              <h4 className="font-orbitron font-bold text-slate-900 text-sm">Climate Controlled</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                100% air-conditioned arena kept at an optimum 21°C to keep you and high-end hardware running cool throughout marathons.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <span className="text-2xl">⚡</span>
              <h4 className="font-orbitron font-bold text-slate-900 text-sm">100% Power Backup</h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Industrial online UPS and silent generator backup ensure you never get disconnected in the final championship round.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-x-4">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="btn-red-action"
          >
            PLAY NOW
          </button>
          <Link href="/contact" className="btn-white-action">
            Find Arena on Map
          </Link>
        </div>

        {/* Lightbox / Zone Detail Modal */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setActiveModalItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 text-slate-900 z-10 shadow-2xl">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-800"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{activeModalItem.icon}</span>
                <div>
                  <h3 className="font-orbitron font-black text-2xl text-slate-900">
                    {activeModalItem.title}
                  </h3>
                  <span className="text-xs font-rajdhani text-[#f92f35] font-bold">
                    {activeModalItem.tagline}
                  </span>
                </div>
              </div>

              <div className="space-y-4 my-6 text-sm text-slate-600 font-sans leading-relaxed">
                <p>{activeModalItem.description}</p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-orbitron font-bold text-[#f92f35] block uppercase">
                    Full Hardware & Pod Configuration
                  </span>
                  <p className="text-xs text-slate-800 font-rajdhani font-semibold">{activeModalItem.specs}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setActiveModalItem(null);
                    setIsBookingOpen(true);
                  }}
                  className="flex-1 py-3 rounded bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider"
                >
                  PLAY NOW · Book This Zone
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-3 rounded border border-slate-200 text-xs font-orbitron font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
