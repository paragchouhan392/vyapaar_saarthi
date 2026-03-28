const steps = [
  {
    num: "1",
    title: "Enter Financial Data",
    desc: "Input your revenue, budgets, assets, and liabilities securely into our platform.",
  },
  {
    num: "2",
    title: "AI Analysis",
    desc: "Our Gemini-powered AI engine reviews your numbers to identify trends, risks, and health.",
  },
  {
    num: "3",
    title: "Get Recommendations",
    desc: "Receive clear, customized action plans to balance budgets and grow your portfolio.",
  },
  {
    num: "4",
    title: "Track & Optimize",
    desc: "Monitor your dashboard dynamically as you apply changes and watch your equity grow.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24 px-6 bg-green-950/60 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-green-200/70 max-w-2xl mx-auto">
            Simple steps to smarter financial decisions
          </p>
        </div>

        <div className="relative">
          {/* Horizontal connecting line - hidden on mobile */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="w-20 h-20 mx-auto bg-green-950 border-2 border-teal-500/30 rounded-full flex items-center justify-center text-2xl font-bold text-teal-300 mb-6 group-hover:border-teal-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all duration-300 relative z-10">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-green-100/60 text-sm leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
