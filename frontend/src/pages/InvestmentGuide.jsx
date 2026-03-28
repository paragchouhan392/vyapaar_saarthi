import { useState } from "react";
import { getBusinessAssistant } from "../services/aiService";

// Helper components for the cards
const RecommendationCard = ({ title, data, type }) => {
  if (!data) return null;

  const { suggestion, message, confidence } = data;

  let ColorIcon = null;
  let bgGradient = "bg-gradient-to-b from-[#18201b] to-[#121614]";
  let ringColor = "ring-1 ring-white/5";
  let textColor = "text-white";
  let accentColor = "bg-white/10";

  const msgLower = (message || "").toLowerCase();

  if (msgLower.includes("increase")) {
    bgGradient = "bg-gradient-to-b from-emerald-900/40 to-[#121614]";
    ringColor = "ring-1 ring-emerald-500/30";
    textColor = "text-emerald-400";
    accentColor = "bg-emerald-500";
    ColorIcon = (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  } else if (msgLower.includes("reduce") || msgLower.includes("decrease")) {
    bgGradient = "bg-gradient-to-b from-rose-900/40 to-[#121614]";
    ringColor = "ring-1 ring-rose-500/30";
    textColor = "text-rose-400";
    accentColor = "bg-rose-500";
    ColorIcon = (
      <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  } else if (msgLower.includes("maintain")) {
    bgGradient = "bg-gradient-to-b from-amber-900/40 to-[#121614]";
    ringColor = "ring-1 ring-amber-500/30";
    textColor = "text-amber-400";
    accentColor = "bg-amber-500";
    ColorIcon = (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    );
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className={`relative p-7 rounded-3xl ${bgGradient} ${ringColor} shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] group overflow-hidden`}>
      {/* Decorative top glow */}
      <div className={`absolute top-0 left-0 w-full h-1 ${accentColor} opacity-50`} />

      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors">{title}</h3>
        <div className={`p-2 rounded-xl bg-black/40 ${ringColor}`}>
          {ColorIcon}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Target Budget</p>
          <p className={`text-4xl font-extrabold tracking-tight drop-shadow-sm ${textColor}`}>
            {suggestion ? formatCurrency(suggestion) : "N/A"}
          </p>
        </div>

        <div className="p-4 bg-black/40 rounded-2xl ring-1 ring-white/5 border border-white/5 backdrop-blur-sm">
          <p className="text-sm font-medium text-gray-300 leading-relaxed">
            {message || "Analysis complete. Optimization paths identified."}
          </p>
        </div>

        {confidence !== undefined && confidence !== null && (
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400">Model Confidence</span>
              <span className="text-xs font-black text-gray-200">{Math.round(confidence * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${accentColor}`}
                style={{ width: `${Math.min(100, Math.max(0, confidence * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIBusinessAssistant = () => {
  const [revenue, setRevenue] = useState("");
  const [inventory, setInventory] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!revenue || isNaN(revenue) || Number(revenue) < 0 || !inventory || isNaN(inventory) || Number(inventory) < 0) {
      setError("Please enter valid numeric amounts for both fields.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await getBusinessAssistant(revenue, inventory);
      if (res.data?.success) {
        setResults(res.data.data);
      } else {
        setError(res.data?.message || "Failed to analyze data via ML models");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred connecting to ML servers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200 tracking-tight">AI Business Assistant</h2>
        <p className="text-emerald-200/70 text-sm mt-2 max-w-2xl font-medium">Instantly analyze your financial state using four independent machine learning endpoints to predict hyper-optimized operational paths.</p>
      </div>

      {/* Input Form Banner - Beautiful full width card */}
      <div className="bg-[#121614]/80 backdrop-blur-2xl ring-1 ring-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <form onSubmit={handleGenerate} className="relative z-10 flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-green-100/60 ml-1">Current Revenue</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 font-bold group-focus-within:text-emerald-400 transition-colors">₹</span>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="5,000,000"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-black/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-green-100/60 ml-1">Current Inventory</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 font-bold group-focus-within:text-emerald-400 transition-colors">₹</span>
                <input
                  type="number"
                  value={inventory}
                  onChange={(e) => setInventory(e.target.value)}
                  placeholder="200,000"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all hover:bg-black/70"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto h-[62px]">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold px-8 rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span>Initialize AI</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="relative z-10 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-6 py-24 rounded-3xl">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-emerald-900/40 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-tight">Analyzing Financial Vectors</h3>
              <p className="text-sm font-medium text-emerald-200/60">Interfacing with remote neural networks...</p>
            </div>
          </div>
        ) : results ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <RecommendationCard title="Marketing Ops" data={results.marketing} type="marketing" />
            <RecommendationCard title="R&D Expansion" data={results.rnd} type="rnd" />
            <RecommendationCard title="Investment Strategy" data={results.investment} type="investment" />
            <RecommendationCard title="Inventory Capacity" data={results.inventory} type="inventory" />
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-center py-24 bg-[#121614]/30 backdrop-blur-sm border border-white/5 rounded-3xl border-dashed">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-inner">
              <svg className="w-10 h-10 text-emerald-400/80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Awaiting Parameters</h3>
            <p className="text-emerald-100/50 max-w-sm mt-3 font-medium text-sm leading-relaxed">
              Inject your current revenue and inventory thresholds above to execute a predictive multi-model simulation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIBusinessAssistant;
