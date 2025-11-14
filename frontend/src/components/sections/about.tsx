import React from 'react';

// --- Icon Components (Inline SVG for reliability and consistency) ---
// Heart Icon (Vision)
const HeartIcon = ({ className = "w-6 h-6", style = {} }) => (
  <img
    src="/vision-icon.png" // Replace with actual image filename
    alt="Heart Icon"
    className={className}
    style={style}
  />
);

const TargetIcon = ({ className = "w-6 h-6", style = {} }) => (
  <img
    src="/mission-icon.png" // Replace with actual image filename
    alt="Target Icon"
    className={className}
    style={style}
  />
);

// --- Value Icons (Re-using existing SVGs) ---
const IconCompassion = ({ className = "w-6 h-6", style = {} }) => (
  <img
    src="/compassion.png" // Replace with actual image filename
    alt="Compassion Icon"
    className={className}
    style={style}
  />
);
const IconIntegrity = ({ className = "w-6 h-6", style = {} }) => (
  <img
    src="/integrity.png" // Replace with actual image filename
    alt="Integrity Icon"
    className={className}
    style={style}
  />
);
const IconInclusivity = ({ className = "w-6 h-6", style = {} }) => (
  <img
    src="/inclusivity.png" // Replace with actual image filename
    alt="Inclusivity Icon"
    className={className}
    style={style}
  />
);
const IconTransformation = ({ className = "w-6 h-6", style = {} }) => (
  <img
    src="/transformation.png" // Replace with actual image filename
    alt="Transformation Icon"
    className={className}
    style={style}
  />
);

const About = () => {
    // --- Soft, Calming Color Palette for Values ---
    const VALUE_COLORS = {
        // Keeping sky blue as the main cool accent color
        blue: { color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-300", shadow: "shadow-[0_15px_30px_rgba(56,189,248,0.15)]" },
        // Maintaining yellow/gold for the warm accent
        yellow: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300", shadow: "shadow-[0_15px_30px_rgba(251,191,36,0.15)]" },
    };

    const coreValues = [
        {
            title: "Compassion",
            desc: "Healing with love and respect for every soul, without judgment.",
            icon: IconCompassion,
            ...VALUE_COLORS.yellow,
        },
        {
            title: "Integrity",
            desc: "Serving the community with honesty and full transparency.",
            icon: IconIntegrity,
            ...VALUE_COLORS.blue,
        },
        {
            title: "Inclusivity",
            desc: "Caring beyond religion, background, or social status.",
            icon: IconInclusivity,
            ...VALUE_COLORS.yellow,
        },
        {
            title: "Transformation",
            desc: "Changing lives through awareness and positive, mindful action.",
            icon: IconTransformation,
            ...VALUE_COLORS.blue,
        },
    ];

    // Placeholder images updated for an emotional, serene theme
    const imageStory = "/happy-people2.png"; // Local image for better control
    const imageCentre = "/sarva-dharma-sangama-centre.jpg"; // Local image for better control
    const imageVision = "/people1.jpeg"; // Local image for better control
    const imageMission = "/people7.png"; // Local image for better control

    // --- Soft Gradient for Header (Pale yellow to pale blue) ---
    const headerGradientStyle = {
        background: 'linear-gradient(90deg, #fefce8 0%, #f0f9ff 100%)',
    };

    return (
        // Universal base background is light yellow
        <section id="about" className="bg-yellow-50 text-gray-900 min-h-screen overflow-hidden">

            {/* 1. Our Story Section - Lighter Yellow Background with Elevated Card and Image */}
<div className="pt-20 pb-32 sm:pt-32 sm:pb-40 bg-yellow-100/70">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
      className="p-8 md:p-16 rounded-[2.5rem] shadow-2xl shadow-yellow-200 relative overflow-hidden transform hover:scale-[1.005] hover:translate-y-[-5px] transition duration-500"
      style={{
        willChange: 'transform, box-shadow',
        backgroundImage: 'url("/yellownature.jpg")', // Replace with your actual image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(255, 255, 255, 0.45)', // soft white overlay
      }}
    >
      <div className="relative grid md:grid-cols-2 gap-12 lg:gap-24 items-center mt-8 backdrop-blur-sm">
        <div className="order-1 relative rounded-xl overflow-hidden">
  {/* Overlay */}
  <div className="absolute inset-0 bg-yellow-100/40 pointer-events-none z-10"></div>

  {/* Image */}
  <img
    src={imageStory}
    alt="Ian Cares Foundation"
    className="w-full h-auto object-cover rounded-xl scale-100 will-change-transform"
  />
</div>




        {/* Text Content */}
        <div className="order-2 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 pb-4 inline-block relative">
            Our Story
            <span className="absolute bottom-0 left-0 w-2/2 h-1 bg-amber-300 rounded-full"></span>
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed font-medium flex justify-content text-center">
            Born out of love and loss, Ian Cares Foundation was established in memory of Ian Austin Mascarenhas — a young soul who inspired compassion and care. After his tragic passing in 2017, his family turned grief into a mission to fight the “3 Ds” — Drinks, Drugs, and Depression — helping others find strength and purpose again.          </p>
          <p className="text-lg text-gray-900 italic border-l-4 border-sky-300 pl-4 font-bold">
            We carry this legacy forward, committed to providing holistic care built on the strength of faith and a supportive community.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>



            {/* 2. Vision & Mission Section - Subtle Yellow-White Background with Floating Cards */}
            <section className="relative bg-yellow-50 py-24 overflow-hidden"> {/* Distinct yellow-white */}
                <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-24">
                    

                    {/* Vision Row - Text on Left, Image on Right */}
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
                        {/* Left: Vision Text Card (Subtle Blue Container, more prominent shadow) */}
                        <div className="space-y-6 p-10 rounded-3xl bg-sky-50 shadow-xl shadow-sky-100 transform hover:translate-y-[-8px] transition duration-500 border border-sky-200"
                             style={{ willChange: 'transform, box-shadow' }}>
                            <HeartIcon className="w-12 h-12 text-sky-600" />
                            <h3 className="text-3xl font-extrabold text-sky-800">Vision: Healing</h3>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                To create a world where every individual lives free from the burdens of addiction and emotional discrimination, embracing healing, unity, and a deeper faith for a complete recovery.
                            </p>
                        </div>

                        <div className="absolute inset-0 bg-yellow-100/20 pointer-events-none z-10"></div>

                        {/* Right: Vision Image - Elevated with softer shadows */}
                        <div className="relative h-[350px] overflow-hidden rounded-xl shadow-xl shadow-sky-100 transform hover:scale-[1.02] transition duration-500"
                             style={{ willChange: 'transform, box-shadow' }}>
                            <img
                                src={imageVision}
                                alt="Vision of Unity"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-sky-500/10"></div>
                        </div>
                    </div>

                    {/* Mission Row - Image on Left, Text Card on Right */}
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
                        {/* Left: Mission Image - Elevated with softer shadows */}
                        <div className="relative h-[350px] overflow-hidden rounded-xl shadow-xl shadow-amber-100 transform hover:scale-[1.02] transition duration-500 md:order-1 order-2"
                             style={{ willChange: 'transform, box-shadow' }}>
                            <img
                                src={imageMission}
                                alt="Mission of Holistic Recovery"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-amber-500/10"></div>
                        </div>

                        {/* Right: Mission Text Card (Subtle Yellow Container, more prominent shadow) */}
                        <div className="space-y-6 p-10 rounded-3xl bg-amber-100 shadow-xl shadow-amber-100 transform hover:translate-y-[-8px] transition duration-500 border border-amber-200 md:order-2 order-1"
                             style={{ willChange: 'transform, box-shadow' }}>
                            <TargetIcon className="w-12 h-12 text-amber-600" />
                            <h3 className="text-3xl font-extrabold text-sky-800">Mission: Recovery</h3>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                To provide comprehensive, holistic recovery programs that nurture the mind, body, and soul. We integrate professional therapy, spiritual grounding, and essential family support services.
                            </p>
                            <button className="text-sky-600 font-semibold text-base hover:text-sky-800 transition duration-300 flex items-center pt-2">
                                Our Programs
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. Core Values Section - Slightly Deeper Yellow Background with Floating Cards */}
            <div className="bg-yellow-100 py-20 sm:py-32"> {/* A slightly deeper yellow shade */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
                        <span className="text-amber-600">Core</span> Values
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, idx) => (
                            <div
                                key={idx}
                                // White Card background with more prominent shadow and subtle lift on hover
                                className={`p-8 rounded-[2rem] bg-white flex flex-col items-center text-center
                                  border-b-4 ${value.border} cursor-pointer
                                  ${value.shadow}
                                  transform hover:scale-[1.03] hover:-translate-y-2 transition duration-300 relative overflow-hidden`}
                                style={{ willChange: 'transform, box-shadow' }}
                            >
                                <div className={`p-5 rounded-full ${value.bg} mb-5 relative z-10 shadow-lg`}>
                                  <value.icon className={`m-10 h-10 ${value.color}`} />
                                </div>
                                <h4 className="text-2xl font-extrabold text-gray-800 mb-2 relative z-10">{value.title}</h4>
                                <p className="text-gray-600 text-base relative z-10">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white py-20 sm:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
      className="relative rounded-[2rem] p-12 md:p-20 border-4 border-sky-300 transform hover:scale-[1.005] transition duration-500 overflow-hidden"
      style={{
        backgroundImage: 'url("/people5.jpeg")', // Replace with actual filename
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.12)',
        willChange: 'transform, box-shadow',
      }}
    >
      {/* White overlay that covers entire container */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0 rounded-[2rem]" />

      {/* Content sits above the overlay */}
      <div className="relative z-10">
        <p className="text-3xl md:text-4xl text-sky-900 font-serif italic text-center leading-snug tracking-wide">
          "The greatest journey is the one where we find compassion within ourselves, and extend it to all."
        </p>
        <p className="text-center mt-8 text-lg font-semibold text-sky-800/80">— Ian Cares Philosophy</p>
      </div>
    </div>
  </div>
</div>



            {/* 5. Centre Section - Base Pale Yellow Background with Elevated White Card */}
            <div className="bg-yellow-50 py-20 sm:py-32"> {/* Base pale yellow */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-2xl shadow-yellow-200 border-t-8 border-sky-500 transform hover:translate-y-[-5px] transition duration-500"
                         style={{ willChange: 'transform, box-shadow' }}>
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-4xl md:text-4xl font-extrabold text-center mb-6 relative pb-2 inline-block text-sky-900">
  The Sarva Dharma Sangama Centre
  <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-full"></span>
</h3>



                                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                                  Located at Quila, Kinnigoli, Sarva Dharma Sangama is a one-of-a-kind rehabilitation and wellness centre — bringing together spirituality, counselling, and community care under one roof.                                </p>
                                <p className="text-xl text-sky-700 font-semibold italic border-l-4 border-amber-500 pl-4">
                                  "When faiths unite, healing begins."                                </p>
                                {/* Action button (BLUE BUTTON) */}
                                <button className="mt-8 px-8 py-3 bg-sky-600 text-white font-bold rounded-full shadow-lg shadow-sky-300/50 hover:bg-sky-700 transition duration-300">
                                    Visit Us
                                </button>
                            </div>
                            <div className="hidden lg:block">
                                <img
                                    src={imageCentre}
                                    alt="Sarva Dharma Sangama Centre"
                                    className="w-full h-auto rounded-3xl shadow-2xl shadow-gray-300/80 object-cover border-4 border-white transform hover:scale-[1.01] transition duration-500"
                                    style={{ willChange: 'transform, box-shadow' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default function App() {
    return (
        <>
            {/* We assume Tailwind is loaded, but include the CDN for completeness in a single-file environment. */}
            <script src="https://cdn.tailwindcss.com"></script>
            <About />
        </>
    );
}
