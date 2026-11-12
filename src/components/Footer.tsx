"use client";

import React from "react";
import Link from "next/link";

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

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-[#050505] border-t border-white/10 overflow-hidden text-white">
      {/* Giant marquee sign-off */}
      <div className="border-b border-white/10 py-6 sm:py-10 overflow-hidden select-none" aria-hidden>
        <div className="flex w-max animate-marquee-slow whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center">
              {["PLAY", "EAT", "CHILL", "REPEAT"].map((w, i) => (
                <span key={w + k} className="flex items-center">
                  <span className={`font-display text-[18vw] sm:text-[12vw] leading-none px-6 ${i % 2 ? "text-outline" : "text-white"}`}>
                    {w}
                  </span>
                  <span className="text-[#e10600] text-5xl sm:text-7xl">✕</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pt-14 pb-24 sm:pb-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-max">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon-3d.png" alt="Virtux" className="w-12 h-12 object-contain mix-blend-screen scale-125 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:perspective(400px)_rotateY(360deg)_scale(1.25)]" />
              <div>
                <span className="font-display text-2xl tracking-wide">VIRTUX</span>
                <span className="block font-mono text-[10px] tracking-[0.3em] text-[#e10600] uppercase">
                  Gaming Hub · Ranaghat
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm">
              Ranaghat&apos;s premier console arena, PC battle station, sim racing & gourmet café sanctuary. Designed for champions and built for true gamers.
            </p>
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#e10600]">
              Play <span className="text-white/30">+</span> Eat <span className="text-white/30">+</span> Chill
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">/ Quick Navigation</h4>
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-3 py-1 text-white/75 hover:text-white transition-colors">
                    <span className="font-mono text-[10px] text-white/30 group-hover:text-[#e10600] transition-colors">0{i + 1}</span>
                    <span className="text-sm transition-transform duration-300 group-hover:translate-x-1.5">{l.label}</span>
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e10600]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operations */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">/ Arena Operations</h4>
            <div className="border border-white/10 p-4 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/45 block">Open 7 Days a Week</span>
              <span className="font-display text-2xl tracking-wide">10:00 AM – 9:30 PM</span>
            </div>
            <ul className="space-y-2 text-xs text-white/60">
              {amenities.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-[#e10600]">+</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">/ Contact & Hub Address</h4>
            <p className="text-sm text-white/65 leading-relaxed">
              <strong className="text-white block mb-1">Virtux Arena Ranaghat:</strong>
              Srimanta Kundu Lane, Nearby Brojoballav Mandir, Ghotokpara, Ranaghat, Nadia, West Bengal, Pin - 741201
            </p>
            <div className="mt-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">Phone & WhatsApp:</span>
              <a href="tel:+919147718768" className="block font-display text-xl tracking-wide hover:text-[#e10600] transition-colors">+91 91477 18768</a>
              <a href="tel:+916294713465" className="block font-display text-xl tracking-wide hover:text-[#e10600] transition-colors">+91 62947 13465</a>
            </div>
            <div className="mt-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">Email Support:</span>
              <a href="mailto:consumersupport.virtuxgaminghub@gmail.com" className="text-sm text-white/75 hover:text-[#e10600] transition-colors break-all">
                consumersupport.virtuxgaminghub@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Ethical statement */}
        <div className="border-l-2 border-[#e10600] bg-[#e10600]/[0.06] p-4 sm:p-5 mb-10 text-xs text-white/65 leading-relaxed">
          <span className="text-[#e10600] font-mono font-bold uppercase tracking-widest mr-2">Ethical Gaming Statement:</span>
          Virtux Gaming Hub does not promote, support or encourage gambling or any activity involving betting your hard-earned money. We serve exclusively as a high-end console and PC hardware rental destination for passionate esports and casual entertainment at fair, transparent pricing.
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <p>© {new Date().getFullYear()} Virtux Gaming Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-[#e10600]">Pricing Policy</Link>
            <span>+</span>
            <Link href="/about" className="hover:text-[#e10600]">Terms of Arena</Link>
            <span>+</span>
            <Link href="/contact" className="hover:text-[#e10600]">Directions</Link>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-white transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
