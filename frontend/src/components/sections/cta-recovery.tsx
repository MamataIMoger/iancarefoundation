import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTARecovery() {
  return (
    <section className="py-20 bg-[#fae476ff] text-white text-center">
      <div className="max-w-5xl mx-auto px-6 space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          The Sooner You Seek Help,
          <br /> The Better Are The Chances to Recovery
        </h2>

        <p className="text-lg md:text-xl text-white/100 max-w-2xl mx-auto">
          Don’t wait for tomorrow. The journey to recovery starts today.
        </p>

        <div className="pt-10 flex justify-center">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#004C91] to-[#00AEEF] text-white px-12 py-4 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,174,239,0.6)]"
                >
                  Book a Confidential Consultation
                </Link>
              </div>
      </div>
    </section>
  );
}