"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function CallToAction() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMounted]);

  if (!hasMounted) return null;

  const base = 900;
  const s1 = 160;

  return (
    <section
      ref={containerRef}
      className="relative py-14 md:py-18 -mt-8"
      style={{ backgroundColor: "#F5E6BE" }}
    >
      <svg
        className="absolute -top-12 left-0 w-full pointer-events-none"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      >
        <path
          d="M0,120 C240,40 480,20 720,70 C960,120 1200,140 1440,100 L1440,0 L0,0 Z"
          fill="#FFFFFF"
          opacity="0.96"
        />
      </svg>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 46,
          left: "50%",
          transform: "translateX(-50%)",
          width: "92%",
          maxWidth: 1200,
          height: 28,
          borderRadius: 20,
          filter: "blur(28px)",
          background: "rgba(3,35,38,0.12)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-8 items-center"
        style={{ zIndex: 5 }}
      >
        <div style={{ paddingTop: 36 }}>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#0B3D43] leading-snug"
            style={{
              margin: 0,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(22px)",
              transition: `opacity ${base}ms cubic-bezier(.19,1,.22,1) ${s1 * 1}ms, transform ${base}ms cubic-bezier(.19,1,.22,1) ${s1 * 1}ms`,
            }}
          >
            The Sooner You Seek Help,
            <span
              className="block text-[#B98B2F]"
              style={{
                display: "block",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(22px)",
                transition: `opacity ${base}ms cubic-bezier(.19,1,.22,1) ${
                  s1 * 1 + 120
                }ms, transform ${base}ms cubic-bezier(.19,1,.22,1) ${s1 * 1 + 120}ms`,
              }}
            >
              The Better Are The Chances to Recovery
            </span>
          </h2>

          <p
            className="text-sm md:text-base text-[#0B3D43]/80"
            style={{
              marginTop: 10,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(26px)",
              transition: `opacity ${base}ms cubic-bezier(.19,1,.22,1) ${
                s1 * 2 + 220
              }ms, transform ${base}ms cubic-bezier(.19,1,.22,1) ${s1 * 2 + 220}ms`,
            }}
          >
            Don’t wait for tomorrow.{" "}
            <span className="font-semibold text-[#007681]">
              The journey to recovery starts today.
            </span>
          </p>
        </div>

        <div className="flex md:justify-end" style={{ paddingTop: 36 }}>
          <Link
            href="/contact"
            className="bg-[#FFC72C] text-[#0B3D43] font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full 
                       text-sm md:text-base shadow-[0_10px_30px_rgba(3,35,38,0.18)] hover:translate-y-[-3px] transform transition-all duration-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(16px)",
              transition: `opacity ${base}ms ease ${s1 * 3 + 300}ms, transform ${base}ms cubic-bezier(.19,1,.22,1) ${
                s1 * 3 + 300
              }ms`,
            }}
          >
            Book a Confidential Consultation ➜
          </Link>
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ opacity: 0.12, zIndex: 2 }}
      >
        <path d="M0,0 C360,40 720,40 1440,0 L1440,80 L0,80 Z" fill="#000" />
      </svg>
    </section>
  );
}
