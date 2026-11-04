"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, cart, setIsCartOpen, setIsBookingOpen, setIsAuthOpen, setAuthTab } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Café", href: "/cafe" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Feedback", href: "/feedback" },
  ];

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2.5"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Brand with Sekiro Red Square Badge */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 bg-[#f92f35] hover:bg-[#e02228] text-white flex flex-col items-center justify-center gap-1 rounded-sm shadow-md transition-colors"
              aria-label="Toggle Navigation Drawer"
            >
              <span className="w-5 h-0.5 bg-white rounded-full"></span>
              <span className="w-5 h-0.5 bg-white rounded-full"></span>
              <span className="w-5 h-0.5 bg-white rounded-full"></span>
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full border border-slate-200 p-0.5 bg-white flex items-center justify-center shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Virtux"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-black tracking-wider text-lg text-slate-900 group-hover:text-[#f92f35] transition-colors">
                  VIRTUX
                </span>
                <span className="text-[10px] font-rajdhani tracking-widest text-[#f92f35] font-bold -mt-1 uppercase">
                  Gaming Hub · Ranaghat
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Clean, Spacious Editorial Style) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative ${
                    isActive
                      ? "text-[#f92f35] border-b-2 border-[#f92f35]"
                      : "text-slate-700 hover:text-[#f92f35]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Café Cart Button with red indicator */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
              title="View Café Order Cart"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#f92f35] text-white font-orbitron text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Account / Login Status */}
            {mounted && user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-rajdhani font-bold hover:border-[#f92f35] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center px-2 py-1 rounded bg-red-50 text-[#f92f35] border border-red-200 text-[10px] font-orbitron font-bold uppercase"
                  >
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("login");
                  setIsAuthOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400 text-xs font-orbitron font-semibold tracking-wider transition-colors"
              >
                <span>Login</span>
              </button>
            )}

            {/* Signature PLAY NOW / BOOK NOW Button */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 sm:px-6 py-2 rounded bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-black text-xs tracking-widest uppercase shadow-crimsonSm transition-all hover:shadow-crimson active:scale-95"
            >
              PLAY NOW
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xl animate-in slide-in-from-top-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-md text-xs font-orbitron font-bold tracking-wider uppercase transition-colors ${
                      isActive
                        ? "text-[#f92f35] bg-red-50 border-l-4 border-[#f92f35]"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full py-2.5 rounded bg-[#f92f35] text-white font-orbitron font-bold text-xs uppercase tracking-wider"
                >
                  ⚡ Book a Gaming Station
                </button>

                {mounted && user ? (
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="w-full py-2 rounded bg-slate-100 text-slate-800 text-xs font-rajdhani font-bold text-center border border-slate-200"
                  >
                    Go to {user.role === "admin" ? "Admin Control" : "Player Dashboard"}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full py-2 rounded border border-slate-200 text-slate-700 text-xs font-orbitron font-semibold text-center"
                  >
                    Player & Admin Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
