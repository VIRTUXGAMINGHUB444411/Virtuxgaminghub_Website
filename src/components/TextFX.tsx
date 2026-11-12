"use client";

import React, { useEffect, useRef, useState } from "react";

/* ───────── hooks ───────── */

/** true once the element has entered the viewport */
export function useInViewOnce<T extends HTMLElement | SVGSVGElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** 0→1 progress while a tall section scrolls past its sticky viewport (pinned scenes). */
export function usePinProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      setP(Math.min(1, Math.max(0, -r.top / span)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, p] as const;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** remap p from [a,b] to [0,1] */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* ───────── components ───────── */

/** Words rise out of a mask with a stagger when the block enters view. */
export const SplitReveal: React.FC<{
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}> = ({ text, className = "", wordClassName = "", delay = 0, stagger = 45, as = "div" }) => {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.2);
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className} data-no-reveal aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] mr-[0.25em] last:mr-0" aria-hidden>
          <span
            className={`inline-block will-change-transform ${wordClassName}`}
            style={{
              transform: seen ? "translateY(0) rotate(0)" : "translateY(110%) rotate(6deg)",
              transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms`,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </Tag>
  );
};

/** Calligraphic word that draws its own outline, then floods with colour. */
export const ScriptDraw: React.FC<{
  text: string;
  className?: string;
  color?: string;
  size?: number;
  viewW?: number;
  viewH?: number;
  progress?: number; // optional scroll-driven 0..1; otherwise plays once in view
}> = ({ text, className = "", color = "#e10600", size = 150, viewW = 900, viewH = 220, progress }) => {
  const [ref, seen] = useInViewOnce<SVGSVGElement>(0.3);
  const k = progress ?? (seen ? 1 : 0);
  return (
    <svg ref={ref} viewBox={`0 0 ${viewW} ${viewH}`} className={className} role="img" aria-label={text}>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "var(--font-script), cursive",
          fontSize: size,
          fill: color,
          fillOpacity: progress === undefined ? (seen ? 1 : 0) : Math.max(0, (k - 0.55) / 0.45),
          stroke: color,
          strokeWidth: 1.4,
          strokeDasharray: 1600,
          strokeDashoffset: 1600 * (1 - k),
          transition: progress === undefined ? "stroke-dashoffset 2.4s cubic-bezier(0.65,0,0.35,1), fill-opacity 1.2s ease 1.6s" : undefined,
        }}
      >
        {text}
      </text>
    </svg>
  );
};

/** Paragraph whose words light up one by one as you scroll through it. */
export const ScrubWords: React.FC<{ text: string; progress: number; className?: string; on?: string; off?: string }> = ({
  text,
  progress,
  className = "",
  on = "#ffffff",
  off = "rgba(255,255,255,0.14)",
}) => {
  const words = text.split(" ");
  return (
    <p className={className} aria-label={text}>
      {words.map((w, i) => {
        const k = clamp01(progress * words.length * 1.15 - i);
        return (
          <span key={i} aria-hidden className="transition-colors duration-150" style={{ color: k > 0.5 ? on : off }}>
            {w}{" "}
          </span>
        );
      })}
    </p>
  );
};

/** Endless horizontal line of text; speed nudged by scroll velocity. */
export const RunningLine: React.FC<{ children: React.ReactNode; className?: string; speed?: number; reverse?: boolean }> = ({
  children,
  className = "",
  speed = 40,
  reverse = false,
}) => {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0, raf = 0, last = performance.now(), lastY = window.scrollY, boost = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      boost += (Math.min(40, Math.abs(dy)) * 6 - boost) * 0.08;
      const el = track.current;
      if (!el || reduce) return;
      const half = el.scrollWidth / 2;
      x += (speed + boost) * dt * (reverse ? -1 : 1);
      if (x > half) x -= half;
      if (x < 0) x += half;
      el.style.transform = `translate3d(${-x}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div ref={track} className="inline-flex will-change-transform">
        <div className="inline-flex">{children}</div>
        <div className="inline-flex">{children}</div>
      </div>
    </div>
  );
};

/** Glyph shuffle: letters scramble then settle when in view. */
export const Scramble: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>(0.5);
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!seen) return;
    const chars = "VX01#/<>+*";
    let f = 0;
    const id = window.setInterval(() => {
      f++;
      setOut(text.split("").map((c, i) => (c === " " || i < f / 2 ? c : chars[Math.floor(Math.random() * chars.length)])).join(""));
      if (f / 2 > text.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [seen, text]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      {out}
    </span>
  );
};
