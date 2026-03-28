import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import WhySection from "./landing/WhySection";
import Features from "./landing/Features";
import HowItWorks from "./landing/HowItWorks";
import CTA from "./landing/CTA";
import Footer from "./landing/Footer";

const Home = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200 bg-gradient-to-br from-green-900 via-teal-900 to-green-950 text-white overflow-x-hidden relative">
      <Navbar />
      <Hero />
      <WhySection />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;