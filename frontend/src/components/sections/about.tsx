// app/about/page.js
"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// --- Icon Components (image-based placeholders) ---
const HeartIcon = ({ className = "w-6 h-6", style = {} }) => (
  <img src="/vision-icon.png" alt="Heart Icon" className={className} style={style} />
);
const TargetIcon = ({ className = "w-6 h-6", style = {} }) => (
  <img src="/mission-icon.png" alt="Target Icon" className={className} style={style} />
);
const IconCompassion = ({ className = "w-6 h-6", style = {} }) => (
  <img src="/compassion.png" alt="Compassion Icon" className={className} style={style} />
);
const IconIntegrity = ({ className = "w-6 h-6", style = {} }) => (
  <img src="/integrity.png" alt="Integrity Icon" className={className} style={style} />
);
const IconInclusivity = ({ className = "w-6 h-6", style = {} }) => (
  <img src="/inclusivity.png" alt="Inclusivity Icon" className={className} style={style} />
);
const IconTransformation = ({ className = "w-6 h-6", style = {} }) => (
  <img src="/transformation.png" alt="Transformation Icon" className={className} style={style} />
);

export default function About() {
  const headerRef = useRef(null);
  const router = useRouter();

  // Page-level animations (plain JS objects)
  const pageContainer = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, when: "beforeChildren" },
    },
  };

  // NOTE: use 'show' as the visible state name (must match parent animate)
  // and avoid string `ease` that may trigger TS typing issues.
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }, // removed `ease` string
    },
  };

  const heroFade = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75 }, // removed `ease` string
    },
  };

  const VALUE_COLORS = {
    blue: {
      color: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-200",
      shadow: "shadow-[0_20px_50px_rgba(14,165,233,0.08)]",
    },
    yellow: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      shadow: "shadow-[0_20px_50px_rgba(249,115,22,0.06)]",
    },
  };

  const coreValues = [
    { title: "Compassion", desc: "Healing with love and respect for every soul.", icon: IconCompassion, ...VALUE_COLORS.yellow },
    { title: "Integrity", desc: "Serving the community with honesty and full transparency.", icon: IconIntegrity, ...VALUE_COLORS.blue },
    { title: "Inclusivity", desc: "Caring beyond religion, background, or social status.", icon: IconInclusivity, ...VALUE_COLORS.yellow },
    { title: "Transformation", desc: "Changing lives through awareness and positive, mindful action.", icon: IconTransformation, ...VALUE_COLORS.blue },
  ];

  const imageStory = "/happy-people2.png";
  const imageCentre = "/sarva-dharma-sangama-centre.jpg";
  const imageVision = "/people1.jpeg";
  const imageMission = "/people7.png";

  return (
    <motion.section
      id="about"
      className="min-h-screen font-['Inter',_sans-serif'] text-gray-900 bg-gray-50 mt-14"
      initial="hidden"
      animate="show"    // parent uses "show"
      variants={pageContainer}
    >
      {/* ------------------ HERO (KEEP EXACTLY AS-IS) ------------------ */}
      <header
        ref={headerRef}
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: "url('/nature4.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "70vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            background: "linear-gradient(rgba(15,134,191,0.65), rgba(4,78,146,0.70))",
            backdropFilter: "blur(3px)",
            willChange: "opacity, transform",
            zIndex: 0,
          }}
        />

        <motion.div
          className="relative z-10 container mx-auto px-6 lg:px-8 py-75 text-center"
          initial="hidden"
          animate="show"      // match heroFade key
          variants={heroFade}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">About IAN Cares Foundation</h1>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Spreading hope, compassion, and healing through unity and faith.
          </p>
        </motion.div>

        <svg viewBox="0 0 1440 200" className="w-full h-40 absolute bottom-0 left-0" preserveAspectRatio="none">
          <path d="M0,64 C240,120 480,120 720,80 C960,40 1200,0 1440,48 L1440,200 L0,200 Z" fill="#ffffff" />
        </svg>
      </header>

      {/* ------------------ LAYOUT: SIDEBAR + MAIN CONTENT ------------------ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR (left column) */}
        <aside className="lg:col-span-3">
          <motion.div className="sticky top-24 rounded-2xl p-6 bg-white border border-gray-100 shadow-md" variants={fadeUp} initial="hidden" animate="show">
            <h4 className="text-lg font-bold text-sky-800">On this page</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <a href="#vision" className="py-2 px-3 rounded-md hover:bg-sky-50">Vision</a>
              <a href="#mission" className="py-2 px-3 rounded-md hover:bg-sky-50">Mission</a>
              <a href="#story" className="py-2 px-3 rounded-md hover:bg-sky-50">Our Story</a>
              <a href="#values" className="py-2 px-3 rounded-md hover:bg-sky-50">Core Values</a>
              <a href="#centre" className="py-2 px-3 rounded-md hover:bg-sky-50">Our Centre</a>
            </nav>

            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-600">Quick contact</p>
              <a href="/contact" className="mt-3 inline-block w-full text-center px-4 py-2 bg-sky-600 text-white rounded-full font-semibold">Contact Us</a>
            </div>
          </motion.div>
        </aside>

        {/* MAIN (right column) */}
        <main className="lg:col-span-9 space-y-8">
          {/* VISION & MISSION (stacked cards) */}
          <motion.section id="vision" className="space-y-6" variants={fadeUp} initial="hidden" animate="show">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <article className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-md">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 mb-4">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-sky-800 mb-2">Vision: Healing</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  We envision a world where every individual lives free from addiction, emotional suffering, and social stigma — a world where faith and compassion become the pillars of healing. Through targeted awareness, quality education, and community support, we restore hope and help people rediscover inner strength and rebuild relationships.
                </p>
              </article>

              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={imageVision} alt="Vision of Unity" className="w-full h-64 md:h-80 object-cover" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center" id="mission">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={imageMission} alt="Mission" className="w-full h-64 md:h-80 object-cover" />
              </div>

              <article className="relative p-6 rounded-2xl bg-amber-50 border border-amber-200 shadow-md">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 mb-4">
                  <TargetIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-sky-800 mb-2">Mission: Recovery</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Providing holistic, compassionate, faith-inspired recovery programs that nurture mind, body, and soul. We combine professional counselling, evidence-based therapies, spiritual guidance, and family support to create long-term change.
                </p>
              </article>
            </div>
          </motion.section>

          {/* OUR STORY (unchanged content) */}
          <motion.section id="story" className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 shadow-inner" variants={fadeUp} initial="hidden" animate="show">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How we Started</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Born out of love, loss, and a steadfast desire to help others, Ian Cares Foundation was established in memory of Ian Austin Mascarenhas — a young person whose kindness inspired everyone who knew him.
                  Following Ian's tragic passing in 2017, family and friends transformed grief into purpose: to fight the “3 Ds” — Drinks, Drugs, and Depression — and to create accessible pathways to recovery and hope.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  What began as a personal mission grew into a community movement focused on mental wellbeing, compassionate care, and faith-led restoration. Today, the Foundation stands as a beacon of support — providing counselling, family programs, community outreach, and education to those who need it most.
                </p>
                <p className="text-lg font-semibold italic text-sky-700 border-l-4 border-sky-300 pl-4">
                  We carry this legacy forward, committed to providing holistic care built on faith and community.
                </p>
              </div>

              <div>
                <img src={imageStory} alt="Ian Cares Foundation" className="w-full rounded-xl shadow-lg object-cover h-72 md:h-80" />
              </div>
            </div>
          </motion.section>

          {/* CORE VALUES (grid) */}
          <motion.section id="values" className="py-4" variants={fadeUp} initial="hidden" animate="show">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4"><span className="text-amber-600">Core</span> Values</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coreValues.map((v, i) => (
                <motion.div key={i} className={`p-4 rounded-2xl bg-white border ${v.border} ${v.shadow}`} whileHover={{ y: -6 }}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-3 ${v.bg} border ${v.border}`}>
                    <v.icon className={`w-7 h-7 ${v.color}`} />
                  </div>
                  <h4 className="text-lg font-bold mb-1">{v.title}</h4>
                  <p className="text-sm text-gray-600">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* QUOTE */}
          <motion.section className="py-6" variants={fadeUp} initial="hidden" animate="show">
            <div className="relative rounded-xl p-6 border-2 border-sky-100 bg-white shadow">
              <p className="text-lg md:text-2xl text-sky-900 font-serif italic leading-tight text-center">
                "The greatest journey is the one where we find compassion within ourselves, and extend it to all."
              </p>
              <p className="mt-3 text-center text-sky-700 font-semibold">— Ian Cares Philosophy</p>
            </div>
          </motion.section>

          {/* CENTRE */}
          <motion.section id="centre" className="py-4" variants={fadeUp} initial="hidden" animate="show">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border-t-8 border-sky-500 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-sky-900 mb-2">The Sarva Dharma Sangama Centre</h3>
                <p className="text-gray-700 mb-2">Located in Quila, Kinnigoli, the Centre is a rehabilitation and wellness sanctuary rooted in unity and faith.</p>
                <p className="text-gray-700 mb-2">Programs include group therapy, meditation, family reintegration, and vocational support.</p>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => router.push("/contact")} className="px-4 py-2 bg-sky-600 text-white rounded-full font-semibold">Visit Us</button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg">
                <img src={imageCentre} alt="Sarva Dharma Sangama Centre" className="w-full h-64 md:h-80 object-cover" />
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </motion.section>
  );
}