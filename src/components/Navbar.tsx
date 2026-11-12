"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";

const navLinks = [
  { name: "Home", href: "/", tag: "Spawn point" },
  { name: "About", href: "/about", tag: "The arena" },
  { name: "Pricing", href: "/pricing", tag: "Rates & passes" },
  { name: "Café", href: "/cafe", tag: "Fuel up" },
  { name: "Gallery", href: "/gallery", tag: "Screenshots" },
  { name: "Contact", href: "/contact", tag: "Find us" },
  { name: "Feedback", href: "/feedback", tag: "Player voice" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, cart, setIsCartOpen, setIsBookingOpen, setIsAuthOpen, setAuthTab } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > last && y > 300);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5" : "bg-transparent border-b border-transparent"}`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Virtux home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-icon-3d.png"
              alt="Virtux"
              className="w-10 h-10 object-contain mix-blend-screen scale-125 transition-transform duration-700 group-hover:[transform:perspective(400px)_rotateY(360deg)_scale(1.25)]"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-xl tracking-wide text-white">VIRTUX</span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#e10600] uppercase mt-0.5">
                Gaming Hub
              </span>
            </div>
          </Link>

          {/* Center: inline links (wide desktop) */}
          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative font-mono text-[11px] tracking-[0.22em] uppercase overflow-hidden h-4 leading-4"
                >
                  <span className={`block transition-transform duration-300 group-hover:-translate-y-full ${active ? "text-[#e10600]" : "text-white/70"}`}>
                    {link.name}
                  </span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-white">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center border border-white/15 text-white/80 hover:text-white hover:border-[#e10600] transition-colors"
              title="View Café Order Cart"
              aria-label="Open cart"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e10600] text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="hidden sm:inline-flex items-center gap-2 h-10 px-3 border border-white/15 text-white/80 hover:text-white hover:border-[#e10600] font-mono text-[11px] uppercase tracking-widest transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{user.name.split(" ")[0]}</span>
                {user.role === "admin" && <span className="text-[#e10600]">· Admin</span>}
              </Link>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("login");
                  setIsAuthOpen(true);
                }}
                className="hidden sm:inline-flex items-center h-10 px-4 border border-white/15 text-white/80 hover:text-white hover:border-white font-mono text-[11px] uppercase tracking-widest transition-colors"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setIsBookingOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 h-10 px-5 bg-[#e10600] hover:bg-white hover:text-black text-white font-mono font-bold text-[11px] tracking-[0.2em] uppercase transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-current rotate-45" />
              Play Now
            </button>

            {/* Hamburger: two lines → X */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative w-11 h-10 flex flex-col items-end justify-center gap-[7px] group"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`block h-[1.5px] bg-white transition-all duration-500 ${open ? "w-8 translate-y-[4.25px] rotate-45" : "w-8 group-hover:w-5"}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-500 ${open ? "w-8 -translate-y-[4.25px] -rotate-45" : "w-5 group-hover:w-8"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── Full-screen blood-red menu ───────── */}
      <div
        className="fixed inset-0 z-40 bg-[#8f0000] text-black transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)]"
        style={{
          clipPath: open ? "circle(150% at calc(100% - 40px) 32px)" : "circle(0% at calc(100% - 40px) 32px)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_85%_0%,#ff2a1f,transparent_60%)]" />
        <div className="relative h-full max-w-[1440px] mx-auto px-5 sm:px-8 pt-24 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10 overflow-y-auto">
          <nav className="flex flex-col">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              const delay = open ? 250 + i * 60 : 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="group flex items-baseline gap-3 sm:gap-5"
                  style={{
                    transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 0.5s ${hovered !== null ? 0 : delay}ms`,
                    transform: open ? "translateY(0)" : "translateY(60px)",
                    opacity: open ? (hovered === null || hovered === i ? 1 : 0.35) : 0,
                  }}
                >
                  <span className="font-mono text-[10px] sm:text-xs text-black/60 w-6">0{i + 1}</span>
                  <span
                    className={`font-display uppercase leading-[0.95] text-[12vw] sm:text-[8.5vw] lg:text-[5.6vw] transition-all duration-500 group-hover:translate-x-4 ${
                      active ? "text-white" : "text-black group-hover:text-white"
                    }`}
                  >
                    {link.name}
                  </span>
                  <span className="hidden md:inline font-mono text-[11px] uppercase tracking-[0.25em] text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    {link.tag}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className="flex flex-col gap-6 font-mono text-xs uppercase tracking-[0.2em] lg:text-right"
            style={{ transition: `opacity 0.6s ${open ? 700 : 0}ms`, opacity: open ? 1 : 0 }}
          >
            <div>
              <p className="text-black/60 mb-1">Call / WhatsApp</p>
              <a href="tel:+919147718768" className="block text-black hover:text-white transition-colors">+91 91477 18768</a>
              <a href="tel:+916294713465" className="block text-black hover:text-white transition-colors">+91 62947 13465</a>
            </div>
            <div>
              <p className="text-black/60 mb-1">Open daily</p>
              <p className="text-black">10:00 AM – 9:30 PM</p>
            </div>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setIsBookingOpen(true);
                }}
                className="h-11 px-6 bg-black text-white hover:bg-white hover:text-black uppercase tracking-[0.2em] transition-colors"
              >
                Book a station
              </button>
              {mounted && user ? (
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="h-11 px-6 border border-black text-black hover:bg-black hover:text-white uppercase tracking-[0.2em] flex items-center justify-center transition-colors"
                >
                  {user.role === "admin" ? "Admin control" : "Player dashboard"}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    setAuthTab("login");
                    setIsAuthOpen(true);
                  }}
                  className="h-11 px-6 border border-black text-black hover:bg-black hover:text-white uppercase tracking-[0.2em] transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
