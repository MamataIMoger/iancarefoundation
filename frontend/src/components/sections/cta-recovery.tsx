import { ArrowRight } from "lucide-react";

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

        <div>
          <button
            className="inline-flex items-center gap-3 bg-white text-blue-500 font-bold px-6 md:px-8 py-3 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/20 transition"
            style={{
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 18px rgba(0,0,0,0.25)',
            }}
          >
            Book a Confidential Consultation
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}