"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

/* ---------- Data ---------- */
const ways = [
  {
    image: "/service1.png",
    title: "Volunteer Opportunities",
    description:
      "Join our volunteer network — assist at the centre, support events, or help with community outreach.",
  },
  {
    image: "/service2.png",
    title: "Program Sponsorships",
    description:
      "Sponsor recovery and wellness programs that deliver structured, long-term support.",
  },
  {
    image: "/service3.png",
    title: "Advocacy & Awareness",
    description:
      "Partner in awareness drives and school programs that reduce stigma and raise knowledge.",
  },
  {
    image: "/meditation1.png",
    title: "CSR Partnerships",
    description:
      "Build longer-term CSR projects with Ian Cares Foundation to create measurable social impact.",
  },
];

/* ---------- Parallax hook ---------- */
function useParallax(
  headerRef: React.RefObject<HTMLElement | null>,
  overlayRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const header = headerRef.current;
    const overlay = overlayRef.current;
    if (!header || !overlay) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          header.style.backgroundPosition = `center ${scrollY * 0.4}px`;
          overlay.style.transform = `translateY(${scrollY * 0.15}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef, overlayRef]);
}

/* ---------- Animation ---------- */
const fade = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75 },
  },
};

/* ---------- Volunteer Form ---------- */
interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  gender: string;
  address: string;
  timeCommitment: string[];
}

const VolunteerForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: "",
    email: "",
    phone: "",
    whatsAppNumber: "",
    gender: "",
    address: "",
    timeCommitment: [],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeCommitmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      timeCommitment: checked
        ? [...prev.timeCommitment, value]
        : prev.timeCommitment.filter((c) => c !== value),
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Submission failed");
      return;
    }

    setIsSubmitted(true);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      whatsAppNumber: "",
      gender: "",
      address: "",
      timeCommitment: [],
    });
  } catch (err) {
    setError("Unexpected error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};



  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-green-100 rounded-xl shadow-lg">
        <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
        <h2 className="text-xl font-bold text-green-700 mb-2">Application Successful!</h2>
        <p className="text-gray-700 text-center">Thank you for applying. We’ll be in touch soon.</p>
        <button
          onClick={onClose}
          className="mt-6 py-2 px-6 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertTriangle size={20} className="mr-2" /> {error}
        </div>
      )}

      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="w-full border px-3 py-2 rounded" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full border px-3 py-2 rounded" />
      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full border px-3 py-2 rounded" />
      <input type="tel" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleChange} placeholder="WhatsApp Number" required className="w-full border px-3 py-2 rounded" />

      <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
        <option value="" disabled>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Non-Binary">Non-Binary</option>
        <option value="Prefer Not To Say">Prefer Not To Say</option>
      </select>

      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" required className="w-full border px-3 py-2 rounded" />

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Preferred Times</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["Mornings", "Afternoons", "Evenings", "Weekdays", "Weekends", "OneTime"].map((opt) => (
            <label key={opt} className="flex items-center space-x-2">
              <input type="checkbox" value={opt} checked={formData.timeCommitment.includes(opt)} onChange={handleTimeCommitmentChange} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-xl bg-yellow-500 text-white font-bold">
        {isLoading ? "Submitting..." : "Submit Contact Information"}
      </button>
    </form>
  );
};

/* ---------- Page Component ---------- */
export default function GetInvolvedPage() {
  const headerRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [showForm, setShowForm] = useState(false);
  useParallax(headerRef, overlayRef);

  return (
    <section className="font-['Inter',_sans-serif'] bg-white text-gray-900 overflow-hidden">
      {/* HERO */}
      <header ref={headerRef} className="relative text-white overflow-hidden" style={{
        backgroundImage: "url('/meditation4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "70vh",
      }}>
  {/*      <div ref={overlayRef} className="absolute inset-0 backdrop-blur-sm" style={{
                    background:
            "linear-gradient(rgba(15,134,191,0.65), rgba(4,78,146,0.70))",
          willChange: "transform, opacity",
        }}
      />
*/}
      <motion.div
        className="relative z-10 container mx-auto px-6 lg:px-8 py-74.5 text-center"
        initial="hidden"
        animate="visible"
        variants={fade}
      >
        <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg">
          Get Involved
        </h1>
        <p className="mt-5 text-lg md:text-xl max-w-3xl mx-auto text-white/95">
          Be part of a movement that heals, restores and transforms lives.
        </p>
      </motion.div>

      <svg
        viewBox="0 0 1440 200"
        className="w-full h-40 absolute bottom-[-1px] left-0 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C240,120 480,120 720,80 C960,40 1200,0 1440,48 L1440,200 L0,200 Z"
          fill="#fff8ec"
        />
      </svg>
    </header>

    {/* ---------- MAIN SECTION ---------- */}
    <div className="bg-gradient-to-b from-[#fff8ec] to-[#eaf6ff] -mt-[1px]">
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 -mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#002c5a]">
            Ways to Contribute
          </h2>
          <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
            Volunteer, sponsor, advocate or partner — choose how you’d like to
            help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {ways.map((w, i) => (
            <motion.article
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={fade}
              transition={{ delay: i * 0.06 }}
              className="relative bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#ffcf70]">
                  <img
                    src={w.image}
                    alt={w.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#0f86bf]">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-gray-700">{w.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>

    {/* ---------- CTA SECTION ---------- */}
    <footer className="py-24 bg-gradient-to-r from-[#0f86bf] to-[#0072A6] text-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-3xl md:text-4xl font-semibold mb-6 leading-snug">
          “Be part of the change — your support can light someone’s path to
          recovery.”
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="group bg-white text-[#0f86bf] px-8 py-3 rounded-full font-bold shadow-md hover:shadow-xl transition transform duration-200 inline-flex items-center gap-2"
        >
          BECOME A VOLUNTEER <ArrowRight size={18} />
        </button>
      </div>
    </footer>

    {/* ---------- Volunteer Form Modal ---------- */}
    {showForm && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Volunteer Application
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
          <VolunteerForm onClose={() => setShowForm(false)} />
        </div>
      </div>
    )}
  </section>
  );
}
