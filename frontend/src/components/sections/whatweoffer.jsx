"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BrainCircuit,
  CloudLightning,
  Users2,
  HeartHandshake,
  HandMetal,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function WhatWeOffer() {
  const PRIMARY_TEAL = "#0085AD";
  const ACCENT_GOLD = "#e7b63b";
  const DARK_TEXT = "#1a2428";

  const services = [
    {
      title: "De-addiction & Rehabilitation Programs",
      icon: BrainCircuit,
      description:
        "Holistic recovery plans tailored to long-term sobriety and mental wellness, integrating cognitive behavioral therapy and group support.",
      number: "01",
      image: "/aadict.jpg",
    },
    {
      title: "Depression & Anxiety Counselling",
      icon: CloudLightning,
      description:
        "Professional support using evidence-based approaches like CBT and mindfulness techniques to effectively manage mood and anxiety disorders.",
      number: "02",
      image: "/depression.jpg",
    },
    {
      title: "Youth Awareness & Motivation Workshops",
      icon: Users2,
      description:
        "Building resilience, confidence, and internal purpose in young adults through engaging, highly interactive sessions and mentorship.",
      number: "03",
      image: "/youthawarness.jpg",
    },
    {
      title: "Family & Relationship Therapy",
      icon: HeartHandshake,
      description:
        "Strengthening emotional bonds, improving communication, and resolving conflicts within families, couples, and significant relationships.",
      number: "04",
      image: "/parents.jpg",
    },
    {
      title: "Yoga, Meditation & Lifestyle Guidance",
      icon: HandMetal,
      description:
        "Integrating holistic practices like breathwork, meditation, and nutritional advice for profound mental peace and stress reduction.",
      number: "05",
      image: "/meditate.jpg",
    },
    {
      title: "Skill-Building & Personal Growth",
      icon: TrendingUp,
      description:
        "Workshops designed to maximize individual potential, covering essential life skills, emotional intelligence, and effective leadership principles.",
      number: "06",
      image: "/skill.jpg",
    },
  ];

  // Intersection Observer Hook (used for cards + heading)
  const useIntersectionObserver = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        // If user prefers reduced motion, consider visible so animations are skipped
        setIsVisible(true);
        return;
      }
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      }, options);
      observer.observe(el);
      return () => el && observer.unobserve(el);
    }, [ref, options]);
    return [ref, isVisible];
  };

  // heading uses the same hook but with a slightly larger threshold
  const [headingRef, headingVisible] = useIntersectionObserver({ threshold: 0.28 });

  return (
    <section
      id="whatweoffer"
      className="relative w-full overflow-visible py-24"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Inline styles for keyframes + glow. Respects prefers-reduced-motion */}
      <style>{`
        @keyframes headingGlowPulse {
          0% {
            box-shadow: 0 8px 30px rgba(7,60,65,0.08), 0 0 0px rgba(231,182,59,0.0);
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            box-shadow: 0 18px 70px rgba(7,60,65,0.14), 0 0 40px rgba(231,182,59,0.10);
            transform: translateY(-4px) scale(1.01);
            opacity: 1;
          }
          100% {
            box-shadow: 0 8px 30px rgba(7,60,65,0.08), 0 0 0px rgba(231,182,59,0.0);
            transform: translateY(0) scale(1);
            opacity: 0.85;
          }
        }

        .heading-glow {
          position: absolute;
          inset: -18px;
          border-radius: 26px;
          z-index: 18;
          pointer-events: none;
          transition: opacity 700ms ease, transform 900ms cubic-bezier(.2,.9,.2,1);
          opacity: 0;
          transform: translateY(6px) scale(0.995);
          background: radial-gradient(ellipse at center, rgba(11,123,130,0.12) 0%, rgba(231,182,59,0.06) 40%, rgba(0,0,0,0) 60%);
          filter: blur(18px);
        }

        .heading-glow.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          animation: headingGlowPulse 3.6s ease-in-out infinite;
        }

        /* Disable animation when prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .heading-glow {
            transition: none;
            animation: none;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* === BEAUTIFUL 3D BACKGROUND (unchanged) === */}
      <div className="absolute inset-0 -z-20">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #f5f7f8 0%, #eef3f2 40%, #faf8f3 80%)",
          }}
        />

        {/* Teal Wave */}
        <svg
          className="absolute top-0 left-0 w-full opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill={PRIMARY_TEAL}
            fillOpacity="0.3"
            d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,186.7C672,171,768,117,864,101.3C960,85,1056,107,1152,133.3C1248,160,1344,192,1392,208L1440,224L1440,0L0,0Z"
          ></path>
        </svg>

        {/* Gold Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-65"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill={ACCENT_GOLD}
            fillOpacity="0.4"
            d="M0,160L60,165.3C120,171,240,181,360,170.7C480,160,600,128,720,106.7C840,85,960,75,1080,90.7C1200,107,1320,149,1380,170.7L1440,192L1440,0L0,0Z"
          ></path>
        </svg>

        {/* Stronger glowing radial orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-65"
          style={{
            top: "10%",
            left: "-8%",
            background:
              "radial-gradient(circle at center, rgba(11,123,130,0.6), rgba(11,123,130,0) 70%)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-6"
          style={{
            bottom: "10%",
            right: "-6%",
            background:
              "radial-gradient(circle at center, rgba(231,182,59,0.65), rgba(231,182,59,0) 70%)",
          }}
        />
      </div>

      {/* ---------- Heading box (with glow behind it) ---------- */}
      <div
        ref={headingRef}
        className={`relative z-20 -mt-28 md:-mt-25 flex justify-center transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-14"
        }`}
      >
        <div style={{ position: "relative", width: "min(1100px, 92%)" }}>
          {/* Glow element behind the box */}
          <div
            className={`heading-glow ${headingVisible ? "visible" : ""}`}
            aria-hidden="true"
          />

          {/* The actual glass heading box */}
          <div
            className="relative rounded-3xl px-6 md:px-10 py-6 md:py-8 backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              zIndex: 20,
            }}
          >
            <div className="flex flex-col items-center justify-center text-center">
              {/* Tagline (appears after box) */}
              <p
                className="uppercase tracking-widest text-xs font-semibold mb-3 text-center"
                style={{
                  color: PRIMARY_TEAL,
                  width: "100%",
                  letterSpacing: "2px",
                  fontFamily: "'El Messiri', sans-serif",
                  opacity: headingVisible ? 1 : 0,
                  transform: headingVisible ? "translateY(0)" : "translateY(18px)",
                  transition:
                    "opacity 1.6s cubic-bezier(.19,1,.22,1), transform 1.6s cubic-bezier(.19,1,.22,1)",
                  transitionDelay: headingVisible ? "0.35s" : "0s",
                }}
              >
                What We Offer
              </p>

              {/* Main Heading */}
              <h2
                className="text-3xl md:text-5xl font-extrabold mb-3"
                style={{
                  color: DARK_TEXT,
                  fontFamily: "'El Messiri', sans-serif",
                  lineHeight: 1.2,
                  opacity: headingVisible ? 1 : 0,
                  transform: headingVisible ? "translateY(0)" : "translateY(22px)",
                  transition:
                    "opacity 1.8s cubic-bezier(.19,1,.22,1), transform 1.8s cubic-bezier(.19,1,.22,1)",
                  transitionDelay: headingVisible ? "0.85s" : "0s",
                }}
              >
                Healing Programs for a{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${PRIMARY_TEAL}, ${ACCENT_GOLD})`,
                  }}
                >
                  Purposeful Life
                </span>
              </h2>

              {/* Gold underline */}
              <div
                className="h-1 w-16 mx-auto mt-2 rounded-full"
                style={{
                  backgroundColor: ACCENT_GOLD,
                  opacity: headingVisible ? 1 : 0,
                  transform: headingVisible
                    ? "translateY(0) scaleX(1)"
                    : "translateY(22px) scaleX(0.6)",
                  transformOrigin: "center",
                  transition:
                    "opacity 1.5s cubic-bezier(.19,1,.22,1), transform 1.5s cubic-bezier(.19,1,.22,1)",
                  transitionDelay: headingVisible ? "1.5s" : "0s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle under the heading (keeps flow) */}
      <div className="relative z-10 mt-8 text-center">
        <p
          className="max-w-2xl mx-auto text-base text-gray-700 font-light"
          style={{ color: DARK_TEXT }}
        >
          Our compassionate approach empowers minds, nurtures hearts, and guides
          every step toward a balanced, peaceful, and purposeful life.
        </p>
      </div>

      {/* ---------- Cards grid (unchanged) ---------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => {
            const Icon = s.icon;
            const [ref, visible] = useIntersectionObserver({ threshold: 0.12 });
            const primaryColor = i % 2 === 0 ? PRIMARY_TEAL : ACCENT_GOLD;

            return (
              <article
                key={s.number}
                ref={ref}
                className={`relative overflow-hidden rounded-3xl transition-all duration-[1000ms] ease-out ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                } hover:scale-[1.03]`}
                style={{
                  minHeight: 320,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.9))`,
                  boxShadow: "0 28px 60px rgba(0,0,0,0.10), 0 10px 30px rgba(0,0,0,0.06)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="absolute inset-0 rounded-3xl" style={{ zIndex: 0 }}>
                  <div
                    style={{
                      backgroundImage: `url('${s.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                      opacity: 0.15,
                      filter: "brightness(1.08) saturate(1.05)",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(to bottom right, rgba(255,255,255,0.25), rgba(255,255,255,0.55))",
                    }}
                  ></div>
                </div>

                <div className="relative z-10 p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: primaryColor,
                          boxShadow: `0 10px 25px ${primaryColor}45`,
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold leading-snug" style={{ color: DARK_TEXT }}>
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-base font-light" style={{ color: DARK_TEXT, opacity: 0.95, lineHeight: 1.6 }}>
                    {s.description}
                  </p>

                  <div className="mt-5">
                    <button className="flex items-center gap-2 text-sm font-semibold" style={{ color: primaryColor }}>
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <a
            href="#explore"
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full text-white font-semibold shadow-xl hover:scale-[1.02] transition-transform"
            style={{ background: PRIMARY_TEAL }}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
