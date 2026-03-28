import { useState, useEffect } from "react";
import { getInvestmentGuides } from "../services/aiService";
import { analyzeWithAI } from "../services/aiService";
import { riskColor } from "../utils/format";

const panelStyle = { background: "rgba(0,40,30,0.45)", backdropFilter: "blur(12px)" };

const RiskBadge = ({ level }) => {
  const map = {
    Low:    "bg-green-500/20 text-green-300 border-green-500/30",
    Medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    High:   "bg-red-500/20  text-red-300   border-red-500/30",
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${map[level] || ""}`}>
      {level} Risk
    </span>
  );
};

const AllocationBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-green-200/70">{label}</span>
      <span className="text-white font-medium">{value}%</span>
    </div>
    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const InvestmentGuide = () => {
  const [guides, setGuides]     = useState([]);
  const [pagination, setPag]    = useState({});
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [analyzing, setAnal]    = useState(false);
  const [error, setError]       = useState("");
  const [aiResult, setAiResult] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getInvestmentGuides(p);
      setGuides(res.data.data.guides);
      setPag(res.data.data.pagination);
    } catch { setError("Failed to load guides."); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const runAnalysis = async () => {
    setAnal(true); setError(""); setAiResult(null);
    try {
      const res = await analyzeWithAI();
      setAiResult(res.data.data.geminiAnalysis);
      load(1); // reload list with the newly saved guide
    } catch (err) {
      setError(err.response?.data?.message || "AI analysis failed. Make sure financial data is submitted first.");
    } finally { setAnal(false); }
  };

  return (
    <div className="p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Investment Guide</h2>
          <p className="text-green-200/60 text-sm mt-1">AI-powered investment recommendations</p>
        </div>
        <button onClick={runAnalysis} disabled={analyzing}
          className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-all disabled:opacity-60">
          {analyzing ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Analysing…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M21.17 8H12V2.83"/></svg>
              Run AI Analysis
            </>
          )}
        </button>
      </div>

      {error && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {/* Live AI Result Banner */}
      {aiResult && (
        <div className="rounded-xl p-6 border border-teal-400/30 shadow-xl" style={panelStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-teal-400/20 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M21.17 8H12V2.83"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Gemini Analysis Complete</p>
              <p className="text-green-200/50 text-xs">Just now</p>
            </div>
            <div className="ml-auto"><RiskBadge level={aiResult.riskLevel} /></div>
          </div>

          <p className="text-green-100/90 text-sm leading-relaxed mb-5">{aiResult.recommendation}</p>

          {aiResult.suggestedAllocation && (
            <div className="space-y-3">
              <p className="text-white font-medium text-sm">Suggested Allocation</p>
              {[
                { label: "Stocks", key: "stocks",  color: "bg-teal-400" },
                { label: "Bonds",  key: "bonds",   color: "bg-blue-400" },
                { label: "Crypto", key: "crypto",  color: "bg-purple-400" },
                { label: "Cash",   key: "cash",    color: "bg-amber-400" },
              ].map(({ label, key, color }) => (
                <AllocationBar key={key} label={label} value={aiResult.suggestedAllocation[key] || 0} color={color} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Past Guides */}
      <div className="rounded-xl border border-white/10 shadow-lg overflow-hidden" style={panelStyle}>
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-semibold">Past Recommendations</h3>
          <p className="text-green-200/50 text-xs mt-0.5">{pagination.total || 0} saved analyses</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-green-200/50 text-sm">Loading…</div>
        ) : guides.length === 0 ? (
          <div className="p-12 text-center text-green-200/40 text-sm">
            No guides yet. Click <strong className="text-white">"Run AI Analysis"</strong> to generate your first recommendation.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {guides.map((g) => (
              <div key={g._id} className="p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <RiskBadge level={g.riskLevel} />
                  <span className="text-green-200/40 text-xs">{new Date(g.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <p className="text-green-100/80 text-sm leading-relaxed mb-4">{g.recommendation}</p>
                {g.suggestedAllocation && Object.keys(g.suggestedAllocation).length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(g.suggestedAllocation).map(([key, val]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-green-200/50 text-xs capitalize">{key}</p>
                        <p className="text-white font-bold text-sm">{val}%</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/10 flex items-center gap-3">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-40 transition-all">← Prev</button>
            <span className="text-xs text-green-200/50">Page {pagination.page} of {pagination.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))} disabled={page === pagination.totalPages}
              className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-40 transition-all">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentGuide;
