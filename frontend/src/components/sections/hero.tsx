"use client";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

type CounterProps = { target: number; label: string };

export default function Hero(){
  const router = useRouter();

  const AnimatedCounter: React.FC<CounterProps> = ({ target, label }) => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 40));
      const timer = window.setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(timer);
    }, [target]);

    return (
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          {count.toLocaleString()}+
        </div>
        <p className="text-white/80 font-medium">{label}</p>
      </div>
    );
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Untitled.mp4" type="video/mp4" />
      </video>

      {/* Contrast overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(3,7,18,0.28), rgba(3,7,18,0.6))",
        }}
      />

      {/* Left aligned hero content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-3xl text-left">
          <span
            className="block text-white text-lg md:text-xl tracking-[0.25em] uppercase mb-4 mt-6 md:mt-10 whitespace-nowrap"
            style={{ fontFamily: "'El Messiri', sans-serif" }}
          >
            WELCOME TO IAN CARES FOUNDATION
          </span>

          <h1
            className="text-4xl md:text-6xl lg:text-[5.25rem] font-bold text-white mb-4"
            style={{
              fontFamily: "'El Messiri', sans-serif",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Healing Minds
            <br />
            with Heart
          </h1>

          <p className="text-white/90 font-semibold text-sm mb-4">SINCE 2017</p>

          <p
            className="text-white/80 max-w-xl text-base md:text-lg leading-relaxed mb-8"
            style={{ fontFamily: "'El Messiri', sans-serif", letterSpacing: "0.01em" }}
          >
            At Ian Cares Foundation, we believe every life deserves a second chance. We walk beside
            individuals struggling with addiction, depression, and emotional distress — guiding them
            toward healing, hope, and happiness.
          </p>

          <div>
          <button
  onClick={() => router.push("/services?booking=1")}
  className="inline-flex items-center gap-3 bg-white/12 text-white px-6 md:px-8 py-3 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/20 transition"
  style={{
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 18px rgba(0,0,0,0.25)",
  }}
>
  BOOK A CONSULT NOW
  <ArrowRight size={18} />
</button>


          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative z-20 w-full bg-transparent -mt-16 md:-mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center text-white">
            <div className="flex flex-col items-center md:items-center">
              <div className="mb-4">
                {/* (svg omitted for brevity) */}
                <svg className="w-16 h-16 text-white/90" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="32" r="4" />
                  <path d="M32 16c-8.837 0-16 7.163-16 16 0 7.732 5.268 14 12 15.732M32 8C18.745 8 8 18.745 8 32c0 11.046 8.954 20 20 20 4.418 0 8-3.582 8-8 0-2.209-.895-4.209-2.343-5.657" />
                  <path d="M32 4c15.464 0 28 12.536 28 28S47.464 60 32 60" />
                </svg>
              </div>
              <AnimatedCounter target={210000} label="Lives Touched" />
            </div>

            <div className="flex flex-col items-center border-t md:border-t-0 md:border-l md:border-r border-white/10 py-8 md:py-0">
              <div className="mb-4">
                <svg className="w-16 h-16 text-white/90" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M32 20a6 6 0 1 1-6-6 6 6 0 0 1 6 6zM50 24a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM18 24a5 5 0 1 1-5-5 5 5 0 0 1 5 5z" />
                  <path d="M16 44v-2a10 10 0 0 1 10-10h12a10 10 0 0 1 10 10v2M10 44v-1a10 10 0 0 1 6-9.27M54 44v-1a10 10 0 0 0-6-9.27" />
                  <path d="M32 28l4-4 4 4 4-4" />
                </svg>
              </div>
              <AnimatedCounter target={24} label="Expert Care (24/7)" />
            </div>

            <div className="flex flex-col items-center md:items-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-white/90" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M32 8l16 6v8a24 24 0 0 1-16 22 24 24 0 0 1-16-22v-8z" />
                  <circle cx="32" cy="28" r="5" />
                  <path d="M32 33v6" />
                </svg>
              </div>
              <AnimatedCounter target={100} label="Private & Secure (%)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}