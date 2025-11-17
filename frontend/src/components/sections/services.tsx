//components/section/services.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ---------- Color Palette ---------- */
const PRIMARY_BG_WHITE = "#FFFFFF";
const ACCENT_PRIMARY_BLUE = "#007AC3";
const ACCENT_PRIMARY_BLUE_DARK = "#005CA0";
const ACCENT_SECONDARY_YELLOW = "#FFC72C";
const TEXT_DARK = "#2E2B27";
const TEXT_MEDIUM_GREY = "#6B6B6B";
const BORDER_LIGHT_GREY = "#F0F0F0";
const CARD_LIGHT_YELLOW_BG = "#FFFBEB";

/* ---------- Data (expanded descriptions) ---------- */
interface ServiceData {
  title: string;
  description: string;
  illustration: string;
}

interface WellnessDetail {
  title: string;
  long: string;
  focus?: string[];
}

const whatWeHealServices: ServiceData[] = [
  {
    title: "Addiction Recovery",
    description:
      "Personalised, evidence-based recovery plans that combine medical supervision, medication-assisted therapy when appropriate, cognitive behavioural therapy (CBT), and structured daily routines. Clients receive individual therapy, group counselling, family sessions, and practical relapse-prevention training. Our program emphasises skills for employment, vocational training, and re-integration into family and community life, with clear measurable milestones for progress.",
    illustration: `/support.jpg`,
  },
  {
    title: "Depression & Anxiety Support",
    description:
      "Short- and long-term therapy tracks that use a blend of CBT, interpersonal therapy, and mindfulness-based stress reduction. We assess each person's symptoms, create an individualized care plan, and teach practical tools — breathing exercises, activity scheduling, sleep hygiene and coping strategies — so clients can see meaningful symptom reduction within weeks and stronger functioning over months.",
    illustration: `/anxiety.png`,
  },
  {
    title: "Family & Relationship Therapy",
    description:
      "Structured family interventions focused on rebuilding trust and improving communication. We run sessions for parents, partners and caretakers to resolve conflict, restore boundaries, and build supportive environments. Family-members are taught coaching skills that reinforce recovery at home and reduce triggers that can lead to relapse.",
    illustration: `/family4.png`,
  },
  {
    title: "Holistic Healing",
    description:
      "An integrative approach including yoga, guided meditation, breathwork, nutrition coaching and light physical conditioning. These practices are woven into clinical therapy to reduce stress, improve sleep, and build resilience. Residents leave with a practical toolkit — breathing patterns, simple daily routines, and personalised nutrition tips — to support long-term wellbeing.",
    illustration: `/meditation4.png`,
  },
  {
    title: "Youth Empowerment",
    description:
      "Interactive workshops for schools and colleges covering mental health literacy, peer pressure resistance, and digital wellbeing. Sessions focus on emotional regulation, goal-setting, interview skills and purpose-driven activities. We also run follow-up mentorship to help teens translate learning into real behaviour change.",
    illustration: `/youth.png`,
  },
  {
    title: "Post-Recovery Care",
    description:
      "Aftercare and mentorship that continues support beyond residential treatment: weekly check-ins, peer mentors, vocational placement assistance and structured community reintegration plans. This reduces relapse risk and helps former residents find employment, education or volunteering opportunities that give purpose and routine.",
    illustration: `post_recovery1.jpg`,
  },
];

const wellnessServices: string[] = [
  "Individual & Group Counselling",
  "Residential Recovery Program",
  "Faith-Integrated Healing (Sarva Dharma Sangama)",
  "Nutritional & Lifestyle Guidance",
  "Meditation & Mindfulness Practice",
  "Emotional Wellness Coaching",
];

const wellnessDetails: WellnessDetail[] = [
  {
    title: "Individual & Group Counselling",
    long: "At Ian Cares Foundation, healing often begins with a conversation. Our individual counselling sessions offer confidential one-on-one support with trained counsellors and mental health professionals. These sessions help clients work through anxiety, depression, grief, or addiction using evidence-based approaches and empathetic listening. Group counselling complements this by bringing together people facing similar challenges — promoting peer support, shared insight, motivation and a sense of community.",
    focus: [
      "Stress, anxiety and depression management",
      "Addiction recovery counselling and relapse prevention",
      "Building self-esteem, coping skills and emotional regulation",
      "Family communication and conflict resolution",
    ],
  },
  {
    title: "Residential Recovery Program",
    long: "Our Residential Recovery Program provides a structured, supportive environment where residents focus fully on healing. A balanced daily schedule includes clinical care, counselling, therapy groups, life-skill workshops, physical activity and spiritual reflection.",
    focus: [
      "24/7 supervision and medical support",
      "Individual therapy + group therapy",
      "Recovery skill-building and vocational planning",
      "Aftercare and community reintegration",
    ],
  },
  {
    title: "Faith-Integrated Healing (Sarva Dharma Sangama)",
    long: "Sarva Dharma Sangama celebrates the unity of all faiths. This faith-integrated program blends spiritual reflection with clinical care, welcoming participants from diverse religious backgrounds.",
    focus: [
      "Interfaith reflection and values-based counselling",
      "Forgiveness and reconciliation work",
      "Compassion-centered group activities",
      "Spiritual practices that complement clinical therapy",
    ],
  },
  {
    title: "Nutritional & Lifestyle Guidance",
    long: "Nutrition and daily habits strongly influence mental health. Our guidance program provides personalized dietary advice, simple fitness routines, and practical workshops on healthy living.",
    focus: [
      "Personalized diet and nutrition planning",
      "Routine building: sleep, exercise and hydration",
      "Hands-on cooking workshops for balanced meals",
      "Breaking habits that harm physical and mental well-being",
    ],
  },
  {
    title: "Meditation & Mindfulness Practice",
    long: "Mindfulness and meditation help quiet the mind and strengthen resilience. Our guided sessions teach breathing techniques, body scans, and mindful movement to reduce anxiety.",
    focus: [
      "Guided meditations and breathing techniques",
      "Mindful movement and beginner yoga",
      "Tools for impulse control and emotion regulation",
      "Daily mindfulness routines for long-term resilience",
    ],
  },
  {
    title: "Emotional Wellness Coaching",
    long: "Emotional Wellness Coaching empowers people to set meaningful goals, identify triggers, and adopt positive coping strategies.",
    focus: [
      "Goal-setting and life coaching",
      "Identifying and managing emotional triggers",
      "Building healthy relationships and communication skills",
      "Long-term progress tracking and motivation",
    ],
  },
];

/* ---------- Small CSS-in-JS ---------- */
const PageStyles: React.FC = () => (
  <style>{`
    .page-root { background: ${PRIMARY_BG_WHITE}; }
    .hero {
      position: relative;
      width: 100%;
      height: min(90vh, 950px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-image: url('/bg3.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: white;
    }
    .hero-overlay { position: absolute; inset: 0; z-index: 10; background: linear-gradient(180deg, rgba(0,122,195,0.62) 0%, rgba(8,160,214,0.5) 60%); backdrop-filter: blur(4px); }
    .hero-inner { position: relative; z-index: 20; text-align: center; padding: 4rem 1rem; max-width: 1100px; }
    .hero-curve { position: absolute; bottom: -2px; left: 0; width: 100%; height: 200px; z-index: 15; }

    .btn-primary { background: ${ACCENT_PRIMARY_BLUE}; color: white; padding: .85rem 2.2rem; border-radius: 9999px; font-weight: 700; box-shadow: 0 6px 22px rgba(0,122,195,0.18); border: none; cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,122,195,0.22); }
    .btn-ghost { background: ${ACCENT_SECONDARY_YELLOW}; color: ${TEXT_DARK}; padding: .7rem 1.8rem; border-radius: 999px; font-weight: 700; border: none; cursor: pointer; transition: transform .18s ease; }
    .btn-ghost:hover { transform: translateY(-3px); }

    .content-wrapper { padding-top: 3rem; max-width: 1100px; margin: 0 auto; }

    .card-grid { display: grid; grid-template-columns: 1fr; gap: 2.25rem; }
    @media(min-width: 768px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(min-width: 1024px) { .card-grid { grid-template-columns: repeat(3, 1fr); } }

    .card-base { border-radius: 18px; overflow: hidden; box-shadow: 0 6px 26px rgba(0,0,0,0.06); border: 1px solid ${BORDER_LIGHT_GREY}; transition: transform .18s ease, box-shadow .18s ease; background: white; }
    .card-base:hover { transform: translateY(-6px); box-shadow: 0 14px 40px rgba(0,0,0,0.08); }

    .summary-wrap { background: #FFF7DB; border-radius: 28px; padding: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.04); border: 1px solid ${BORDER_LIGHT_GREY}; }
    .hover-card { transition: all .28s ease; border-radius: 12px; }
    .hover-card:hover { transform: translateY(-6px); box-shadow: 0 8px 25px rgba(0,122,195,0.12); background: #fffdf3; }

    .details-grid { display: grid; gap: 1.75rem; grid-template-columns: 1fr; }
    @media(min-width: 768px) { .details-grid { grid-template-columns: repeat(2, 1fr); } }

    .detail-card { border-radius: 14px; background: white; padding: 1.25rem; border: 1px solid ${BORDER_LIGHT_GREY}; box-shadow: 0 8px 30px rgba(0,0,0,0.03); transition: transform .2s ease; }
    .detail-card:hover { transform: translateY(-4px); }

    .highlight { box-shadow: 0 0 0 8px rgba(0,122,195,0.06); transform: translateY(-4px); transition: all .45s ease; }

    .consult-card { background: #fff; border-radius: 18px; padding: 1.6rem; box-shadow: 0 18px 40px rgba(2,6,23,0.06); border: 1px solid rgba(240,240,240,1); transition: transform .18s ease, box-shadow .18s ease; }
    .consult-card:hover { transform: translateY(-4px); box-shadow: 0 28px 60px rgba(2,6,23,0.08); }

    .form-row { display: grid; gap: .85rem; }
    @media(min-width:720px) { .form-row.cols-2 { grid-template-columns: repeat(2, 1fr); } }

    .form-field { display: flex; align-items: center; gap: .6rem; background: #fff; border-radius: 12px; padding: .45rem .6rem; border: 1px solid ${BORDER_LIGHT_GREY}; transition: box-shadow .16s ease, border-color .16s ease; }
    .form-field:focus-within { border-color: ${ACCENT_PRIMARY_BLUE}; box-shadow: 0 6px 26px rgba(0,122,195,0.06); }

    .form-field svg { opacity: .9; width: 18px; height: 18px; }

    .form-input, .form-select, .form-textarea { border: none; outline: none; width: 100%; font-size: .98rem; color: ${TEXT_DARK}; background: transparent; padding: .4rem 0; }
    .form-textarea { min-height: 92px; resize: vertical; }
    .form-hint { color: ${TEXT_MEDIUM_GREY}; font-size: .92rem; margin-top: .55rem; text-align: center; }

    .btn-submit { display: inline-flex; gap: .6rem; align-items: center; justify-content: center; padding: .85rem 1.05rem; border-radius: 999px; border: none; cursor: pointer; font-weight: 800; box-shadow: 0 10px 26px rgba(0,0,0,0.06); transition: transform .16s ease, box-shadow .16s ease, filter .12s ease; background: linear-gradient(90deg, ${ACCENT_SECONDARY_YELLOW}, #ffd84f); color: ${TEXT_DARK}; }
    .btn-submit:hover { transform: translateY(-3px); filter: brightness(.99); box-shadow: 0 14px 36px rgba(0,0,0,0.08); }

    .success-inline { background: rgba(0,122,195,0.06); color: ${ACCENT_PRIMARY_BLUE_DARK}; border-radius: 10px; padding: .65rem .9rem; font-weight: 700; text-align: center; margin-bottom: .85rem; transition: opacity .3s ease, transform .22s ease; }

    /* small helper for multi-line clamp */
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; white-space: normal; }
  `}</style>
);

/* ---------- Framer Motion Variants (hero) ---------- */
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const heroHeading = {
  hidden: { y: 36, opacity: 0, scale: 0.98 },
  show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const heroSub = {
  hidden: { y: 22, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

/* ---------- Typed Intersection Observer hook ---------- */
function useIntersectionObserver<T extends Element = HTMLElement>(options?: IntersectionObserverInit): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, options]);

  return [ref as any, isVisible];
}

/* ---------- ServiceCard Component ---------- */
const ServiceCard: React.FC<{ s: ServiceData; primaryColor: string; onBook: () => void }> = ({ s, primaryColor, onBook }) => {
  const [ref, visible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.12 });
  const [expanded, setExpanded] = React.useState(false);
  const showToggle = s.description.length > 220;

  return (
    <article
      ref={ref}
      className={`relative overflow-hidden rounded-3xl transition-all duration-[1000ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} hover:scale-[1.03]`}
      style={{
        minHeight: 320,
        background: `linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.9))`,
        boxShadow: "0 28px 60px rgba(0,0,0,0.10), 0 10px 30px rgba(0,0,0,0.06)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="absolute inset-0 rounded-3xl" style={{ zIndex: 0 }}>
        <div style={{
          backgroundImage: `url('${s.illustration}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
          opacity: 0.12,
          filter: "brightness(1.06) saturate(1.05)",
        }} />
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ background: "linear-gradient(to bottom right, rgba(255,255,255,0.25), rgba(255,255,255,0.55))" }}
        />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: primaryColor, boxShadow: `0 10px 25px ${primaryColor}45` }}
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M2 12h20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold leading-snug" style={{ color: TEXT_DARK }}>{s.title}</h3>
          </div>
        </div>

        <p
          className={`mt-3 text-base font-light ${!expanded ? "line-clamp-3" : ""}`}
          style={{ color: TEXT_DARK, opacity: 0.95, lineHeight: 1.7 }}
        >
          {s.description}
        </p>

        <div style={{ marginTop: 12 }}>
          {s.title === "Addiction Recovery" && (
            <ul style={{ marginTop: 8, color: TEXT_MEDIUM_GREY, fontSize: ".95rem", lineHeight: 1.5 }}>
              <li>• Medical supervision & withdrawal support</li>
              <li>• Individual + group therapy and family integration</li>
              <li>• Relapse prevention and vocational planning</li>
            </ul>
          )}
          {s.title === "Holistic Healing" && (
            <ul style={{ marginTop: 8, color: TEXT_MEDIUM_GREY, fontSize: ".95rem", lineHeight: 1.5 }}>
              <li>• Daily yoga and breathwork</li>
              <li>• Guided meditation sessions</li>
              <li>• Nutrition & lifestyle coaching</li>
            </ul>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            {showToggle && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-sm font-medium underline-offset-2 hover:underline"
                style={{ color: primaryColor }}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
          <button
            onClick={onBook}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow transition hover:scale-[1.02]"
            style={{ background: primaryColor, color: "#fff" }}
          >
            Book a Consultation
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

/* ---------- ConsultFormInner (popup form usage) ---------- */
function ConsultFormInner({ onClose }: { onClose?: () => void }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [serviceVal, setServiceVal] = React.useState<string>("");

  React.useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setSubmitted(false), 3800);
    return () => clearTimeout(t);
  }, [submitted]);

  return (
    <>
      {submitted && (
        <div className="success-inline" role="status" aria-live="polite">
          ✅ Thank you — we received your request. We will contact you soon.
        </div>
      )}

<form
  onSubmit={async (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const raw = Object.fromEntries(formData.entries()) as Record<string, any>;

    // Combine country code and phone number here
    if (raw.country_code && raw.phone) {
      raw.phone = raw.country_code + raw.phone;
    }
    delete raw.country_code;

    // Handle 'Other' service logic
    if (raw.service === "Other" && raw.service_other) {
      raw.service = raw.service_other;
    }
    delete raw.service_other;

    try {
      const response = await fetch("/api/admin/consult-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Submission failed");

      target.reset();
      setServiceVal("");
      setSubmitted(true);
      if (onClose) setTimeout(() => onClose(), 900);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Sorry, something went wrong. Please try again.");
    }
  }}
  style={{ display: "grid", gap: 12 }}
>
  <div className="form-row cols-2">
    <label className="form-field" style={{ alignItems: "center" }}>
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input name="name" className="form-input" placeholder="Full name" required />
    </label>

    <label className="form-field">
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
        <path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h2.07a2 2 0 0 1 2 1.72c.12 1.11.37 2.19.73 3.21a2 2 0 0 1-.45 2.11L8.9 12.9a12.3 12.3 0 0 0 5.2 5.2l1.86-1.86a2 2 0 0 1 2.11-.45c1.02.36 2.1.61 3.21.73A2 2 0 0 1 22 16.92z" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
        <div style={{ display: 'flex', gap: '8px' }}>
      <select
        name="country_code"
        defaultValue="+91"
        className="form-select"
        aria-label="Select country code"
        style={{ maxWidth: '80px' }}
        required
      >
        <option value="+91">+91 (IN)</option>
        <option value="+1">+1 (US)</option>
        <option value="+44">+44 (UK)</option>
        {/* Add more country codes as needed */}
      </select>

        <input
          name="phone"
          type="tel"
          className="form-input"
          placeholder="Phone number"
          pattern="[0-9]{10}"
          inputMode="numeric"
          required
        />
      </div>

    </label>
  </div>

  <div className="form-row cols-2">
    <label className="form-field">
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
        <path d="M4 4h16v16H4z" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input name="email" type="email" className="form-input" placeholder="Email address" required />
    </label>

    <label className="form-field">
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
        <path d="M3 7h18M3 12h18M3 17h18" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <select name="service" className="form-select" required value={serviceVal} onChange={(e) => setServiceVal(e.target.value)}>
        <option value="" disabled>Select service</option>
        {whatWeHealServices.map((s) => (
          <option key={s.title} value={s.title}>{s.title}</option>
        ))}
        <option value="Other">Other</option>
      </select>
    </label>
  </div>

  {serviceVal === "Other" && (
    <label className="form-field" style={{ marginTop: -6 }}>
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18, marginTop: 6 }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input name="service_other" className="form-input" placeholder="Please specify the service" required />
    </label>
  )}

  <div className="form-row cols-2">
    <label className="form-field">
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
        <path d="M3 8h18M7 4v4M17 4v4" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input name="date" type="date" className="form-input" />
    </label>

    <label className="form-field">
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
        <path d="M12 7v5l3 3" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <select name="mode" className="form-select" required defaultValue="">
        <option value="" disabled>Preferred mode</option>
        <option value="In-person">In-person at Centre</option>
        <option value="Online">Online / Video Call</option>
      </select>
    </label>
  </div>

  <label className="form-field" style={{ alignItems: "stretch" }}>
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18, marginTop: 6 }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <textarea name="message" className="form-textarea" placeholder="Briefly describe your concern..." />
  </label>

  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <label style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT_MEDIUM_GREY }}>
      <input type="checkbox" name="consent" required />
      <span style={{ fontSize: ".95rem" }}>I agree to be contacted by Ian Cares Foundation.</span>
    </label>

    <div style={{ marginLeft: "auto" }}>
      <button type="submit" className="btn-submit" aria-label="Book appointment">
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
          <path d="M5 12h14M12 5l7 7-7 7" stroke={TEXT_DARK} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Book Appointment
      </button>
    </div>
  </div>

  <div className="form-hint">We respect your privacy — your details will only be used to arrange this consultation.</div>
</form>
    </>
  );
}

/* ---------- Main Component ---------- */
export default function ServicesPage() {
  const moreRef = React.useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("booking") === "1") {
      setShowModal(true);
      params.delete("booking");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  function scrollToDetails() {
    moreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSummaryClick(idx: number) {
    const el = document.getElementById(`detail-${idx}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("highlight");
    setTimeout(() => el.classList.remove("highlight"), 1400);
  }

  return (
    <div className="page-root">
      <PageStyles />

      {/* Popup modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(3px)",
          }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
              borderRadius: 16,
              padding: "1.5rem",
              width: "92%",
              maxWidth: 640,
              boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 14,
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                color: TEXT_MEDIUM_GREY,
                cursor: "pointer",
              }}
              aria-label="Close booking form"
            >
              ✕
            </button>

            <h2 style={{ color: ACCENT_PRIMARY_BLUE, fontWeight: 800, fontSize: "1.35rem", marginBottom: 8, textAlign: "center" }}>
              Book a Consultancy
            </h2>
            <p style={{ textAlign: "center", color: TEXT_MEDIUM_GREY, marginBottom: 20 }}>
              Fill in a few details and our team will contact you to schedule the consultation.
            </p>

            <ConsultFormInner onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {/* Hero section */}
      <header className="hero mt-14" role="banner" aria-hidden={false}>
        <div className="hero-overlay" />
        <motion.div className="hero-inner" variants={heroContainer} initial={shouldReduceMotion ? "show" : "hidden"} animate="show">
          <motion.p variants={heroSub as any} style={{ color: ACCENT_SECONDARY_YELLOW, fontWeight: 700, letterSpacing: ".08em", marginBottom: ".6rem", textTransform: "uppercase" }}>
            Our Focus Areas
          </motion.p>
          <motion.h1 variants={heroHeading as any} style={{ fontSize: "3.25rem", lineHeight: 1.02, margin: 0, fontWeight: 800, color: "white", textShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
            What We Heal
          </motion.h1>
          <motion.p variants={heroSub as any} style={{ marginTop: "1rem", color: "rgba(255,255,255,0.92)", maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            Ian Cares Foundation addresses diverse needs across the healing journey — from mental health support to holistic recovery.
          </motion.p>
          <motion.div variants={heroSub as any} style={{ marginTop: "1.8rem", display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={scrollToDetails}>Explore Services</button>
            <button className="btn-ghost" onClick={() => setShowModal(true)} aria-label="Book a consultancy">Book a Consultancy</button>
          </motion.div>
        </motion.div>
        <svg className="hero-curve" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden>
          <path d="M0,160 C240,220 480,220 720,180 C960,140 1200,80 1440,120 L1440,220 L0,220 Z" fill="#ffffff" />
        </svg>
      </header>

      <main className="content-wrapper" role="main">
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem 2.25rem" }}>
          <p style={{ textAlign: "center", color: "#6B6B6B", fontSize: "1.05rem", maxWidth: "850px", margin: "0 auto 2rem", lineHeight: "1.7" }}>
            Our healing programs combine professional expertise with personalized care, supporting individuals through mental health challenges, emotional recovery, and personal growth.
          </p>

          <div className="card-grid">
            {whatWeHealServices.map((s, i) => {
              const primaryColor = i % 2 === 0 ? ACCENT_PRIMARY_BLUE : ACCENT_SECONDARY_YELLOW;
              return <ServiceCard key={s.title} s={s} primaryColor={primaryColor} onBook={() => setShowModal(true)} />;
            })}
          </div>
        </section>

        <section style={{ maxWidth: 920, margin: "1.5rem auto", padding: "0 1rem 2rem" }}>
          <div className="summary-wrap">
            <h3 style={{ textAlign: "center", margin: 0, fontSize: "1.6rem", color: TEXT_DARK, fontWeight: 700 }}>Wellness Services</h3>
            <p style={{ textAlign: "center", color: TEXT_MEDIUM_GREY, marginTop: ".6rem" }}>Click any item to read more about that program below.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 14 }}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                  {wellnessServices.map((svc, idx) => (
                    <button key={idx} onClick={() => handleSummaryClick(idx)} className="hover-card" style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14, background: "#fff", border: `1px solid ${BORDER_LIGHT_GREY}`, borderRadius: 12, textAlign: "left", cursor: "pointer" }}>
                      <span style={{ color: ACCENT_SECONDARY_YELLOW, fontWeight: 800, marginTop: 2 }}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span style={{ color: TEXT_MEDIUM_GREY, fontSize: "1rem" }}>{svc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={moreRef} style={{ maxWidth: 1100, margin: "2rem auto 4rem", padding: "0 1rem" }}>
          <h3 style={{ textAlign: "center", fontSize: "1.8rem", color: TEXT_DARK, marginBottom: 10 }}>Service Details & Programs</h3>
          <p style={{ textAlign: "center", color: TEXT_MEDIUM_GREY, marginBottom: 20 }}>Each program below is designed to restore balance, build skills and support long-term wellbeing.</p>

          <div className="details-grid">
            {wellnessDetails.map((d, i) => (
              <div id={`detail-${i}`} key={i} className="detail-card">
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 999, background: ACCENT_PRIMARY_BLUE, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: TEXT_DARK, fontWeight: 700 }}>{d.title}</h4>
                    <p style={{ marginTop: 8, color: TEXT_MEDIUM_GREY, fontSize: ".95rem", lineHeight: 1.5 }}>{d.long}</p>
                    {d.focus && (
                      <ul style={{ marginTop: 10, color: TEXT_MEDIUM_GREY, fontSize: ".92rem" }}>
                        {d.focus.map((f, idx) => <li key={idx} style={{ marginBottom: 6 }}>{f}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING SECTION: CTA only (modal opens on click) */}
        <section id="booking" style={{ maxWidth: 920, margin: "3rem auto 4rem", padding: "0 1rem" }}>
          <div className="consult-card" style={{ padding: "1.75rem", background: "linear-gradient(135deg, #E9F6FF, #ffffff)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
              <div>
                <h2 style={{ margin: 0, color: ACCENT_PRIMARY_BLUE, fontSize: "1.6rem", fontWeight: 800 }}>
                  Ready to Start Your Healing Journey?
                </h2>
                <p style={{ margin: 0, marginTop: 6, color: TEXT_MEDIUM_GREY, fontSize: ".95rem" }}>
                  Click below to book your free consultation — our team will reach out within 24 hours.
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontSize: ".9rem", color: TEXT_MEDIUM_GREY }}>Fast response</div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ borderRadius: 10, background: "#fff", padding: 6, border: `1px solid ${BORDER_LIGHT_GREY}` }}>
                  <path d="M12 2v6" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12h14" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22v-6" stroke={ACCENT_PRIMARY_BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button className="btn-primary" onClick={() => setShowModal(true)} style={{ fontSize: "1rem", padding: ".9rem 2.2rem" }}>
                Book Now
              </button>
            </div>
          </div>
        </section>

        <footer style={{ textAlign: "center", color: "#7b7b7b", fontSize: ".85rem", marginBottom: "2.5rem" }}>
          © {new Date().getFullYear()} Ian Cares Foundation — All rights reserved
        </footer>
      </main>
    </div>
  );
}
