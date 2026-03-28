import { useNavigate } from "react-router-dom";

const stats = [
  { value: "10K+",     label: "Businesses Served" },
  { value: "₹500Cr+", label: "Finances Managed"   },
  { value: "99.9%",   label: "AI Accuracy"         },
  { value: "6+",      label: "Smart Modules"       },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">

      {/* Radial glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-green-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-teal-200 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          AI-Powered Financial Intelligence
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="text-white">Smart</span>{" "}
          <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
            Financial Decisions
          </span>
          <br />
          <span className="text-white">for Your Business</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Vyapaar Saarthi uses AI to analyze your business finances, generate smart budgeting plans,
          and give you real-time insights — all in one powerful dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => navigate("/register")}
            className="group bg-white text-green-900 font-bold px-8 py-4 rounded-xl text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 hover:bg-teal-50"
          >
            Create Free Account
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
          >
            Log In to Dashboard
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-4 py-5 hover:bg-white/15 transition-all duration-200"
            >
              <p className="text-2xl font-extrabold text-teal-300">{s.value}</p>
              <p className="text-xs text-white/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-950/60 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
