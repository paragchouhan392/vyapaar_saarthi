const Footer = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-green-950/80 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="max-w-xs">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
            Vyapaar<span className="text-teal-400">Saarthi</span>
          </h2>
          <p className="text-sm text-green-200/60 leading-relaxed">
            AI-powered financial advisor for modern businesses. Helping you plan, analyze, and grow with confidence.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <div className="flex flex-col gap-3 text-sm text-green-200/60">
              <button onClick={() => scrollTo("features")} className="text-left hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollTo("how")} className="text-left hover:text-white transition-colors">How It Works</button>
              <button onClick={() => scrollTo("why")} className="text-left hover:text-white transition-colors">Why Us</button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="flex flex-col gap-3 text-sm text-green-200/60">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-300/40">
        <p>© {new Date().getFullYear()} Vyapaar Saarthi. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
