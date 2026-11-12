"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Logo3D } from "@/components/Logo3D";

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

  /* the full-screen menu is only for widths without inline links: close it if the window grows past xl */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const menuBtn = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState("calc(100% - 48px) 44px");
  const toggleMenu = () => {
    const r = menuBtn.current?.getBoundingClientRect();
    if (r) setOrigin(`${r.left + r.width / 2}px ${r.top + r.height / 2}px`);
    setOpen((o) => !o);
  };

  /* sliding highlight that follows the hovered link and rests on the active one */
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoverLink, setHoverLink] = useState<number | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });
  const activeIdx = navLinks.findIndex((l) => l.href === pathname);
  useEffect(() => {
    const place = () => {
      const i = hoverLink ?? activeIdx;
      const el = i >= 0 ? linkRefs.current[i] : null;
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth, on: true } : (p) => ({ ...p, on: false }));
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [hoverLink, activeIdx, mounted]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header
        className={`fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !open ? "-translate-y-[140%]" : "translate-y-0"
        }`}
      >
        <div
          className={`vx-nav pointer-events-auto relative mx-auto max-w-[1180px] pl-1.5 pr-1.5 sm:pl-2 flex items-center justify-between gap-3 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? "h-14 sm:h-[60px]" : "h-14 sm:h-16"
          } ${
            open
              ? "bg-transparent border-transparent"
              : scrolled
              ? "bg-[#070707]/85 border-white/[0.09] backdrop-blur-2xl shadow-[0_20px_60px_-24px_rgba(225,6,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "bg-[#070707]/60 border-white/[0.09] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          }`}
        >
          {/* hairline red sheen travelling along the bottom edge */}
          {!open && (
            <span aria-hidden className="pointer-events-none absolute inset-x-10 -bottom-px h-px overflow-hidden rounded-full">
              <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#ff2a1f] to-transparent animate-[vxSheen_5s_ease-in-out_infinite]" />
            </span>
          )}
          {/* Brand: live 3D emblem + wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Virtux Gaming Hub home">
            <span className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[radial-gradient(circle_at_50%_40%,#2a0605,#050505_70%)] border border-white/10 overflow-hidden group-hover:border-[#e10600]/70 transition-colors duration-500">
              <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(225,6,0,0.6),transparent_35%)] animate-[spin_3.5s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-[1.5px] rounded-full bg-[radial-gradient(circle_at_50%_40%,#250504,#050505_72%)]" />
              {/* pointer-events-none so the whole badge stays a plain link */}
              <span className="absolute -inset-[18%] pointer-events-none">
                <Logo3D className="w-full h-full" />
              </span>
            </span>
            <span className="flex flex-col leading-none pr-1.5">
              <span className="font-display text-[19px] tracking-[0.06em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                VIRTUX
              </span>
              <span className="mt-1 flex items-center gap-1.5 font-mono text-[8.5px] font-medium tracking-[0.34em] uppercase text-white/80">
                <span className="w-2.5 h-px bg-[#ff3b30]" />
                Gaming Hub
              </span>
            </span>
          </Link>

          {/* Center: inline links inside a nested pill (wide desktop) */}
          <nav
            ref={navRef}
            onMouseLeave={() => setHoverLink(null)}
            className="hidden xl:flex relative items-center gap-0.5 rounded-full bg-white/[0.035] border border-white/[0.06] p-1"
          >
            <span
              aria-hidden
              className={`absolute top-1 bottom-1 left-0 rounded-full transition-[transform,width,background-color,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hoverLink !== null && hoverLink !== activeIdx ? "bg-white/[0.1]" : "bg-[#e10600] shadow-[0_0_22px_-4px_rgba(225,6,0,0.9)]"
              }`}
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.on ? 1 : 0 }}
            />
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setHoverLink(i)}
                  className={`group relative z-10 font-mono text-[10.5px] tracking-[0.2em] uppercase overflow-hidden h-9 px-3.5 rounded-full flex items-center transition-colors duration-300 ${
                    active || hoverLink === i ? "text-white" : "text-white/65"
                  }`}
                  style={{ animation: `vxNavIn 0.8s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.05}s both` }}
                >
                  <span className="relative block h-4 leading-4 overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">{link.name}</span>
                    <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-white">
                      {link.name}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-white/15 text-white/80 hover:text-white hover:border-[#e10600] hover:bg-[#e10600]/10 transition-colors"
              title="View Café Order Cart"
              aria-label="Open cart"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e10600] text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="hidden md:inline-flex items-center gap-2 h-11 px-4 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-[#e10600] font-mono text-[10.5px] uppercase tracking-widest transition-colors"
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
                className="hidden md:inline-flex items-center h-11 px-4 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white font-mono text-[10.5px] uppercase tracking-widest transition-colors"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setIsBookingOpen(true)}
              className="group relative overflow-hidden hidden sm:inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#e10600] hover:bg-white hover:text-black text-white font-mono font-bold text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-300 shadow-[0_0_24px_-4px_rgba(225,6,0,0.8)]"
            >
              <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent animate-[vxShine_3.2s_ease-in-out_infinite] group-hover:opacity-0" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span className="relative">Play Now</span>
            </button>

            {/* Menu button: round, two lines → X (same animation) */}
            <button
              ref={menuBtn}
              onClick={toggleMenu}
              className={`xl:hidden relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center gap-[6px] group border transition-colors ${
                open ? "bg-black border-black" : "bg-white/5 border-white/15 hover:border-[#e10600]"
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`block h-[1.5px] bg-white transition-all duration-500 ${open ? "w-5 translate-y-[3.75px] rotate-45" : "w-5 group-hover:w-3"}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-500 ${open ? "w-5 -translate-y-[3.75px] -rotate-45" : "w-3 group-hover:w-5"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── Full-screen blood-red menu ───────── */}
      <div
        className="fixed inset-0 z-40 bg-[#8f0000] text-black transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)]"
        style={{
          clipPath: `circle(${open ? 150 : 0}% at ${origin})`,
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
