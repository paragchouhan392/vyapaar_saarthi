import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-green-950/80 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-xl font-bold text-white cursor-pointer tracking-tight"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Vyapaar<span className="text-teal-300">Saarthi</span>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <button onClick={() => scrollTo("features")}  className="hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollTo("why")}       className="hover:text-white transition-colors">Why Us</button>
          <button onClick={() => scrollTo("how")}       className="hover:text-white transition-colors">How It Works</button>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-1.5"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-green-900 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-teal-100 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200"
          >
            Register Now →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-950/95 backdrop-blur border-t border-white/10 px-6 py-4 space-y-3">
          {[["features","Features"],["why","Why Us"],["how","How It Works"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left text-white/80 hover:text-white text-sm py-2 border-b border-white/5 transition-colors">
              {label}
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate("/login")} className="flex-1 border border-white/30 text-white text-sm py-2 rounded-lg hover:bg-white/10 transition-all">Log In</button>
            <button onClick={() => navigate("/register")} className="flex-1 bg-white text-green-900 font-semibold text-sm py-2 rounded-lg hover:bg-teal-100 transition-all">Register</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
