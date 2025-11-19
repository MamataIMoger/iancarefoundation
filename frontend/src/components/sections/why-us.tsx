// components/WhyUs.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  { title: "Holistic Approach", text: "Comprehensive rehabilitation and wellness programs.", img: "/card1.jpg" },
  { title: "Faith-Based Healing", text: "Sarva Dharma Sangama spiritual foundation.", img: "/card2.jpg" },
  { title: "Expert Team", text: "Experienced counselors & medical professionals.", img: "/card3.jpg" },
  { title: "Confidential Care", text: "Respectful, private, and family-oriented support.", img: "/card4.jpg" },
];

export default function WhyUs() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || (navigator && navigator.maxTouchPoints > 0));
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    const startY = 50,
      endY = 85,
      startThreshold = 0.15,
      ease = 0.12,
      maxDt = 40;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    let targetY = startY,
      currentY = startY,
      rafId = 0,
      last = performance.now();

    function calcProgress(): number {
      const node = wrapperRef.current;
      if (!node) return 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const viewportBottom = window.scrollY + vh;
      const sectionTop = window.scrollY + rect.top;
      const total = rect.height + vh;
      const passed = viewportBottom - sectionTop;
      return clamp(passed / total, 0, 1);
    }

    const onScrollResize = () => {
      const p = calcProgress();
      if (p <= startThreshold) targetY = startY;
      else {
        const localP = (p - startThreshold) / (1 - startThreshold);
        const y = startY + localP * (endY - startY);
        targetY = clamp(y, Math.min(startY, endY), Math.max(startY, endY));
      }
    };

    onScrollResize();
    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize);

    const loop = (now: number) => {
      const node = wrapperRef.current;
      if (!node) {
        rafId && cancelAnimationFrame(rafId);
        return;
      }
      const dt = Math.min(maxDt, now - last);
      last = now;
      const alpha = 1 - Math.pow(1 - ease, dt / 16.67);
      currentY += (targetY - currentY) * alpha;
      node.style.backgroundPosition = `center ${Math.round(currentY * 100) / 100}%`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      rafId && cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollResize);
      window.removeEventListener("resize", onScrollResize);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg,#EAF6FF 0%, #FFF8EA 100%)",
      }}
    >
      {/* HERO / HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8 md:pt-16 md:pb-10">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 mx-auto w-full max-w-4xl rounded-2xl -z-10"
            style={{
              height: 160,
              marginTop: -6,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
              boxShadow: "0 8px 40px rgba(13,38,63,0.06)",
              backdropFilter: "blur(6px) saturate(110%)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* use a motion.div wrapper (not motion.h1) and then a semantic h1 inside */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mx-auto max-w-4xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              <span className="text-[#005A9C]">Why Choose </span>
              <span className="text-[#FFC72C]">Ian Cares Foundation?</span>
            </h1>

            <div
              className="mx-auto mt-4 w-36 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg, #007DC5, #FFC72C)" }}
            />

            <p className="mt-6 text-center mx-auto max-w-3xl text-base sm:text-lg text-slate-700 leading-relaxed">
              We combine <strong className="text-[#005A9C]">evidence-based treatment</strong> with compassionate, family-centred support so people can recover with dignity and hope.
            </p>
          </motion.div>
        </div>
      </div>

      {/* MAIN PANEL (parallax background) */}
      <div className="relative max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          ref={wrapperRef}
          className="relative rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(13,38,63,0.06)] bg-white"
          style={{
            backgroundImage: "url('/nature.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 50%",
            transform: "translate3d(0,0,0)",
            willChange: "background-position",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(120deg, rgba(230,247,255,0.72) 0%, rgba(255,250,240,0.56) 100%)",
              backdropFilter: "blur(4px) saturate(115%)",
              WebkitBackdropFilter: "blur(4px) saturate(115%)",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start p-8 sm:p-12 lg:p-14 relative z-10">
            {/* LEFT: Illustration */}
            <div className="flex justify-center items-start mt-10 lg:mt-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/6.jpg"
                  alt="Healing illustration"
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover rounded-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* RIGHT: Paragraph + Timeline */}
            <div className="space-y-8 text-left lg:pl-6">
              <div className="bg-white/60 p-6 rounded-xl shadow-sm" style={{ backdropFilter: "blur(4px)" }}>
                <p className="text-lg md:text-xl text-slate-800 leading-relaxed max-w-xl">
                  At <strong className="text-[#005A9C]">Ian Cares Foundation</strong>, recovery is a guided journey — clinical care combined with a supportive community. Our programs are evidence-driven and delivered with warmth so people find steady, lasting healing.
                </p>
              </div>

              {/* TIMELINE */}
              <div className="relative pl-12 mt-2">
                <div className="absolute left-6 top-0 bottom-0 w-[3px] rounded-full" style={{ background: "linear-gradient(180deg,#007DC5,#FFC72C)" }} />
                <div className="space-y-12">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.55, delay: i * 0.08 }}
                      className="relative pl-16"
                    >
                      <motion.div
                        whileHover={{ scale: 1.06, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
                        className="absolute -left-12 top-0 w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg"
                        style={{ background: "linear-gradient(90deg,#005A9C,#FFC72C)" }}
                      >
                        <Image src={f.img} alt={f.title} width={96} height={96} className="object-cover w-full h-full" />
                      </motion.div>

                      <h3 className="text-2xl font-semibold mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#005A9C] to-[#2F8FB8]">
                          {f.title}
                        </span>
                      </h3>

                      <p className="text-slate-700 text-base leading-relaxed max-w-lg">{f.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-10 flex justify-center">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#004C91] to-[#00AEEF] text-white px-12 py-4 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,174,239,0.6)]"
                >
                  Book a Confidential Consultation
                </Link>
              </div>
            </div>
          </div>

          {/* bottom wave */}
          <div className="w-full mt-8 -mb-1 relative z-10">
            <svg viewBox="0 0 1440 80" className="w-full h-12" preserveAspectRatio="none">
              <path d="M0,0 C300,120 950,0 1440,80 L1440,0 L0,0 Z" fill="#fbfbfc" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
