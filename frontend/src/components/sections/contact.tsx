// components/contact.tsx

"use client";

import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const PRIMARY_BLUE = "#0072A6";
const ACCENT_YELLOW = "#FFC72C";

type FormState = { name: string; email: string; phone: string; message: string };

const Footer: React.FC = () => (
  <footer className="py-6 bg-white text-center text-[#0072A6]">
    <p className="italic text-lg font-light mb-2">"In every act of care, Ian lives on."</p>
    <p className="text-sm text-gray-700">© {new Date().getFullYear()} IAN Cares Foundation. All rights reserved.</p>
  </footer>
);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<null | "success" | "error">(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmissionStatus(null);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        // Handle API errors (e.g., validation failed, server error)
        const errorData = await response.json();
        console.error("Submission failed:", errorData.message);
      }

    } catch (error) {
      console.error("Network or Fetch Error:", error);
      setSubmissionStatus("error"); // You would need to add "error" to FormState type
    } finally {
      setIsLoading(false);
      // Optional: Clear status after a few seconds
      setTimeout(() => setSubmissionStatus(null), 4000); 
    }
  };

  return (
    <section className="pt-0 pb-16 px-4 sm:px-6 lg:px-8 bg-white text-[#0B3D43]">
      <div
        className="relative w-full h-[600px] bg-fixed bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/inaug13.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-6xl mx-auto mt-16 rounded-3xl shadow-md overflow-hidden border border-gray-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 sm:p-10 space-y-5 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#0B3D43]">
              Contact <span className="text-[#0072A6]">IAN Cares Foundation</span>
            </h2>

            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-lg mt-1 text-[#FFC72C]" />
                <div>
                  <h4 className="font-semibold text-[#000000]">Our Campus</h4>
                  <p>Sarva Dharma Sangama Campus, Quila, Kinnigoli, Dakshina Kannada – 574150</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="fas fa-phone-alt text-lg text-[#FFC72C]" />
                <a href="tel:+919740296297" className="hover:underline text-[#000000]">+91 97402 96297</a>
              </div>

              <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-lg text-[#FFC72C]" />
                <a href="mailto:info@iancaresfoundation.org" className="hover:underline text-[#000000]">info@iancaresfoundation.org</a>
              </div>

              <div className="flex items-center gap-3">
                <i className="fas fa-globe text-lg text-[#000000]" />
                <a href="https://www.iancaresfoundation.org" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#000000]">www.iancaresfoundation.org</a>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-[#000000]">Follow Us</h3>

          {/* SOCIAL ICONS */}
          <div className="flex gap-6 mt-6">
            <a
              href="https://www.instagram.com/iancaresfoundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFC72C] transition"
              aria-label="Ian Cares Instagram"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zm4.5 3.25A4.75 4.75 0 1112 16.75 4.75 4.75 0 0112 7.25zm0 2A2.75 2.75 0 1014.75 12 2.75 2.75 0 0012 9.25zm4.75-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/ian-cares-foundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFC72C] transition"
              aria-label="Ian Cares LinkedIn"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3A2 2 0 0121 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 17.34V10.7H6v6.64h2.34zm-1.17-7.72a1.35 1.35 0 11.01-2.7 1.35 1.35 0 01-.01 2.7zM18 17.34v-3.56c0-1.9-.4-3.37-2.57-3.37-1.11 0-1.86.61-2.17 1.18h-.03V10.7H11v6.64h2.23v-3.29c0-.87.17-1.72 1.25-1.72 1.06 0 1.08.99 1.08 1.78v3.23H18z" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/IanCaresFoundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFC72C] transition"
              aria-label="Ian Cares Facebook"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.95V15h-2v-3h2v-2.3C10.5 7.9 11.92 6.5 14.4 6.5c1.02 0 2.1.18 2.1.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.45V12h2.58l-.41 3h-2.17v6.95A10 10 0 0022 12z" />
              </svg>
            </a>
          </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-8 border-t border-gray-300 pt-4 max-w-md mx-auto w-full">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:outline-none placeholder-gray-500 text-sm" />
              <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:outline-none placeholder-gray-500 text-sm" />
              <input type="tel" name="phone" placeholder="Phone Number*" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:outline-none placeholder-gray-500 text-sm" />
              <textarea name="message" placeholder="Message" rows={3} value={formData.message} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:outline-none resize-none placeholder-gray-500 text-sm" />

              {submissionStatus === "success" && <p className="text-sm text-green-600">✅ Message Sent Successfully!</p>}

              <div className="pt-2 text-center">
                <button type="submit" disabled={isLoading} className={`w-full sm:w-3/4 py-3 px-4 rounded-full text-sm font-semibold transition-all shadow-md ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 hover:shadow-lg"}`} style={isLoading ? { backgroundColor: "#cccccc", color: "#ffffff" } : { backgroundColor: ACCENT_YELLOW, color: "#ffffff" }}>
                  {isLoading ? "SUBMITTING..." : "SEND"}
                </button>
              </div>
            </form>
          </div>

          <div className="relative flex justify-center items-center bg-[#f9fafb] mt-10 lg:mt-0">
            <div className="absolute right-0 top-0 bottom-0 rounded-l-3xl hidden lg:block" style={{ width: 350, backgroundColor: PRIMARY_BLUE, zIndex: 0 }} />

            <div className="relative z-10 w-[90%] sm:w-[80%] h-[300px] sm:h-[400px] lg:h-[420px] rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
              <h3 className="text-lg sm:text-xl font-bold mb-3 px-6 pt-4 text-[#0072A6]">Our Location</h3>
              <div className="w-full h-[240px] sm:h-[340px]">
                <iframe title="IAN Care Foundation Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.588649360679!2d74.85698277454799!3d13.061835212894518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba3533430ad52cf%3A0x7db8e71c14789ed5!2sIan%20Care%20Foundation!5e0!3m2!1sen!2sin!4v1761894249109!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// MAIN PAGE
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white mt-15">
      <main className="flex-grow">
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
