"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Logo3D } from "@/components/Logo3D";

/* ─────────────── Custom cursor: red dot + lagging ring, grows on interactive elements ─────────────── */
export const CustomCursor: React.FC = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    let x = window.innerWidth / 2, y = window.innerHeight / 2, rx = x, ry = y, raf = 0;
    let hover = false, down = false;

    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest("a, button, [role=button], input, select, textarea, label, [data-cursor]");
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ring.current) {
        const s = (hover ? 1.9 : 1) * (down ? 0.75 : 1);
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${s})`;
        ring.current.style.borderColor = hover ? "#e10600" : "rgba(255,255,255,0.55)";
        ring.current.style.background = hover ? "rgba(225,6,0,0.12)" : "transparent";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="fixed top-0 left-0 z-[100] w-9 h-9 rounded-full border pointer-events-none transition-[background,border-color] duration-200" />
      <div ref={dot} className="fixed top-0 left-0 z-[100] w-1.5 h-1.5 rounded-full bg-[#e10600] pointer-events-none" />
    </>
  );
};

/* ─────────────── Scroll reveal: tags headings / cards / sections in <main> on every route ─────────────── */
export const ScrollReveal: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const tag = () => {
      const auto = root.querySelectorAll<HTMLElement>(
        "[data-reveal], h1, h2, .editorial-card, section > div > .grid > *, main > div > div > .grid > *"
      );
      auto.forEach((el) => {
        if (el.dataset.rvDone || el.closest("[data-no-reveal]")) return;
        el.dataset.rvDone = "1";
        // stagger siblings in grids
        const parent = el.parentElement;
        if (parent && parent.classList.contains("grid")) {
          const idx = Array.from(parent.children).indexOf(el);
          el.style.setProperty("--rv-delay", `${Math.min(idx, 8) * 70}ms`);
        }
        el.classList.add(el.dataset.reveal === "mask" ? "rv-mask" : "rv");
        // already in viewport → reveal on next frame
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          requestAnimationFrame(() => el.classList.add("rv-in"));
        } else io.observe(el);
      });
    };

    const t = window.setTimeout(tag, 60);
    // pick up content rendered later (filters, tabs, client data)
    const mo = new MutationObserver(() => tag());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
};

/* ─────────────── Boot loader: counts to 100, then "click / tap anywhere to enter" ─────────────── */
export const BootLoader: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const ready = n >= 100;

  useEffect(() => {
    let v = 0;
    const id = window.setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 9));
      setN(v);
      if (v >= 100) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, []);

  const enter = () => {
    if (!ready || leaving) return;
    setLeaving(true);
    window.setTimeout(onEnter, 900);
  };

  useEffect(() => {
    if (!ready) return;
    const k = (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && enter();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      onClick={enter}
      className={`fixed inset-0 z-[90] bg-[#050505] flex flex-col justify-between p-5 sm:p-10 select-none transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${ready ? "cursor-pointer" : ""}`}
      style={{ clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
    >
      <div className="flex justify-between font-mono text-[10px] sm:text-xs tracking-[0.3em] text-white/50 uppercase">
        <span>Virtux // Arena OS</span>
        <span>Ranaghat · IN</span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Logo3D className="w-[min(78vw,420px)] h-[min(78vw,420px)] sm:w-[440px] sm:h-[440px]" />
        <p className={`font-mono text-[11px] sm:text-xs tracking-[0.35em] uppercase text-center transition-opacity duration-500 ${ready ? "opacity-100 text-white animate-pulse" : "opacity-0"}`}>
          Click anywhere to enter the arena
        </p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="flex-1 max-w-md">
          <div className="h-[2px] bg-white/10 overflow-hidden">
            <div className="h-full bg-[#e10600] transition-[width] duration-150" style={{ width: `${n}%` }} />
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
            {ready ? "Systems online" : "Loading stations · shaders · snacks"}
          </p>
        </div>
        <span className="font-display text-[22vw] sm:text-[14vw] leading-[0.8] text-white tabular-nums">
          {n}
        </span>
      </div>
    </div>,
    document.body
  );
};

/* ─────────────── Magnetic wrapper: element drifts toward the pointer ─────────────── */
export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number; className?: string }> = ({
  children,
  strength = 0.3,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0,0)";
      }}
    >
      {children}
    </div>
  );
};
