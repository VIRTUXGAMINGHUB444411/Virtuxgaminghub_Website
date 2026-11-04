"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#f8fafc] border-t border-slate-200 pt-16 pb-12 overflow-hidden text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#f92f35] p-1 flex items-center justify-center shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Virtux" className="w-full h-full object-contain filter brightness-200" />
              </div>
              <div>
                <span className="font-orbitron font-black tracking-wider text-xl text-slate-900">
                  VIRTUX
                </span>
                <span className="block text-[10px] font-rajdhani tracking-widest text-[#f92f35] font-bold -mt-1 uppercase">
                  Gaming Hub · Ranaghat
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Ranaghat&apos;s premier console arena, PC battle station, sim racing & gourmet café sanctuary. Designed for champions and built for true gamers.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-orbitron font-extrabold text-[#f92f35] tracking-widest uppercase">
              <span>PLAY</span>
              <span className="text-slate-400">·</span>
              <span>EAT</span>
              <span className="text-slate-400">·</span>
              <span>CHILL</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#f92f35] rounded-full" />
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-rajdhani font-bold text-slate-600">
              <li>
                <Link href="/" className="hover:text-[#f92f35] transition-colors">⚡ Arena Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f92f35] transition-colors">🛡️ About Our Facility</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#f92f35] transition-colors">💳 Rates & Memberships</Link>
              </li>
              <li>
                <Link href="/cafe" className="hover:text-[#f92f35] transition-colors">☕ Gamer Café & Bites</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#f92f35] transition-colors">📸 Arena Gallery</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f92f35] transition-colors">📍 Location & Hours</Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-[#f92f35] transition-colors">⭐ Gamer Reviews</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operations & Amenities */}
          <div>
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#f92f35] rounded-full" />
              Arena Operations
            </h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <span className="text-slate-500 block font-rajdhani font-semibold">Open 7 Days a Week</span>
                <span className="font-orbitron font-extrabold text-slate-900 text-sm">10:00 AM – 9:30 PM</span>
              </div>

              <div className="space-y-1.5 text-slate-600 font-sans">
                <p className="flex items-center gap-2">
                  <span className="text-[#f92f35] font-bold">✓</span> 100% Air-Conditioned Arena (21°C)
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#f92f35] font-bold">✓</span> Dual UPS & Silent Generator Backup
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#f92f35] font-bold">✓</span> Gigabit Optical Fiber LAN
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#f92f35] font-bold">✓</span> Sanitized Hardware Between Sessions
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Contacts */}
          <div>
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#f92f35] rounded-full" />
              Contact & Hub Address
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <p className="leading-relaxed">
                <strong className="text-slate-900 block font-rajdhani text-sm">Virtux Arena Ranaghat:</strong>
                Srimanta Kundu Lane, Nearby Brojoballav Mandir, Ghotokpara, Ranaghat, Nadia, West Bengal, Pin - 741201
              </p>

              <div className="pt-1">
                <span className="text-slate-500 block">Phone & WhatsApp:</span>
                <a href="tel:+919147718768" className="text-[#f92f35] font-bold block hover:underline">
                  +91 91477 18768
                </a>
                <a href="tel:+916294713465" className="text-[#f92f35] font-bold block hover:underline">
                  +91 62947 13465
                </a>
              </div>

              <div>
                <span className="text-slate-500 block">Email Support:</span>
                <a
                  href="mailto:consumersupport.virtuxgaminghub@gmail.com"
                  className="text-slate-700 hover:text-[#f92f35] transition-colors block break-all font-sans"
                >
                  consumersupport.virtuxgaminghub@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Statement Banner */}
        <div className="p-4 rounded-lg bg-red-50/70 border border-red-200 mb-8 text-xs text-slate-700 text-center leading-relaxed font-sans">
          <span className="text-[#f92f35] font-bold uppercase font-rajdhani tracking-wider mr-2">
            🛡️ Ethical Gaming Statement:
          </span>
          Virtux Gaming Hub does not promote, support or encourage gambling or any activity involving betting your hard-earned money. We serve exclusively as a high-end console and PC hardware rental destination for passionate esports and casual entertainment at fair, transparent pricing.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-rajdhani">
          <p>© {new Date().getFullYear()} Virtux Gaming Hub. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold">
            <Link href="/pricing" className="hover:text-[#f92f35]">Pricing Policy</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-[#f92f35]">Terms of Arena</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#f92f35]">Directions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
