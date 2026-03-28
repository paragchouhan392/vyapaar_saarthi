import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-teal-900/40 to-green-900/40 border border-teal-500/20 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Take Control of Your <br className="hidden md:block" /> Business Finances Today
          </h2>
          <p className="text-lg text-teal-100/70 mb-10 max-w-2xl mx-auto">
            Let AI guide your financial decisions and maximize growth. Join thousands of businesses scaling smarter with Vyapaar Saarthi.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-green-900 font-bold px-10 py-5 rounded-xl text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 hover:bg-teal-50 transition-all duration-300"
          >
            Create Free Account →
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
