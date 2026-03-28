import { useState, useEffect } from "react";
import { getBalanceSheet, addBalanceSheet } from "../services/balanceService";
import { fmt } from "../utils/format";

const panelStyle = { background: "rgba(0,40,30,0.45)", backdropFilter: "blur(12px)" };
const inputCls   = "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm";

const BalanceSheet = () => {
  const [entries, setEntries]   = useState([]);
  const [pagination, setPag]    = useState({});
  const [page, setPage]         = useState(1);
  const [latest, setLatest]     = useState(null);
  const [form, setForm]         = useState({ assets: "", liabilities: "" });
  const [loading, setLoading]   = useState(true);
  const [submitting, setSub]    = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getBalanceSheet(p);
      const data = res.data.data;
      setEntries(data.entries);
      setPag(data.pagination);
      if (p === 1 && data.entries.length > 0) setLatest(data.entries[0]);
    } catch { setError("Failed to load balance sheet."); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true); setError(""); setSuccess("");
    try {
      await addBalanceSheet({ assets: Number(form.assets), liabilities: Number(form.liabilities) });
      setForm({ assets: "", liabilities: "" });
      setShowForm(false);
      setSuccess("Balance sheet entry added successfully.");
      load(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save entry.");
    } finally { setSub(false); }
  };

  const equity = latest ? latest.assets - latest.liabilities : 0;
  const ratio  = latest && latest.assets > 0 ? ((latest.liabilities / latest.assets) * 100).toFixed(1) : 0;

  return (
    <div className="p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Balance Sheet</h2>
          <p className="text-green-200/60 text-sm mt-1">Company financial position over time</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Entry
        </button>
      </div>

      {error   && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-teal-500/20 border border-teal-400 text-teal-300 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {/* Latest Snapshot Cards */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Assets",      value: fmt(latest.assets),      color: "text-teal-300" },
            { label: "Total Liabilities", value: fmt(latest.liabilities),  color: "text-red-400" },
            { label: "Equity",            value: fmt(equity),              color: equity >= 0 ? "text-green-300" : "text-red-400" },
            { label: "Debt Ratio",        value: `${ratio}%`,              color: ratio < 50 ? "text-green-300" : "text-amber-400" },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-5 border border-white/10 shadow-lg" style={panelStyle}>
              <p className="text-green-200/60 text-sm">{c.label}</p>
              <p className={`text-2xl font-bold mt-2 ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Visual Bar */}
      {latest && (
        <div className="rounded-xl p-6 border border-white/10 shadow-lg" style={panelStyle}>
          <h3 className="text-white font-semibold mb-4">Assets vs Liabilities</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-200/70">Assets</span>
                <span className="text-teal-300">{fmt(latest.assets)}</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-200/70">Liabilities</span>
                <span className="text-red-400">{fmt(latest.liabilities)}</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full"
                  style={{ width: `${Math.min(ratio, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-200/70">Equity</span>
                <span className={equity >= 0 ? "text-green-300" : "text-red-400"}>{fmt(equity)}</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${equity >= 0 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(Math.abs(equity / (latest.assets || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Form */}
      {showForm && (
        <div className="rounded-xl p-6 border border-teal-400/20 shadow-lg" style={panelStyle}>
          <h3 className="text-white font-semibold mb-4">New Balance Sheet Entry</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Total Assets (₹) *</label>
              <input className={inputCls} type="number" min="0" placeholder="0"
                value={form.assets} onChange={e => setForm({...form, assets: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Total Liabilities (₹) *</label>
              <input className={inputCls} type="number" min="0" placeholder="0"
                value={form.liabilities} onChange={e => setForm({...form, liabilities: e.target.value})} required />
            </div>
            {form.assets && form.liabilities && (
              <div className="md:col-span-2 bg-white/5 rounded-lg px-4 py-2 text-sm text-green-200/70">
                Equity Preview: <span className="font-semibold text-white">{fmt(Number(form.assets) - Number(form.liabilities))}</span>
              </div>
            )}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting}
                className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-all disabled:opacity-60">
                {submitting ? "Saving…" : "Save Entry"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-lg text-sm border border-white/20 text-white/70 hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Table */}
      <div className="rounded-xl border border-white/10 shadow-lg overflow-hidden" style={panelStyle}>
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-semibold">History</h3>
          <p className="text-green-200/50 text-xs mt-0.5">{pagination.total || 0} entries recorded</p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-green-200/50 text-sm">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-green-200/40 text-sm">No entries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-green-200/50 border-b border-white/10 text-left">
                  {["Date", "Assets", "Liabilities", "Equity", "Debt Ratio"].map(h => (
                    <th key={h} className="px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((e) => {
                  const eq  = e.assets - e.liabilities;
                  const dr  = e.assets > 0 ? ((e.liabilities / e.assets) * 100).toFixed(1) : 0;
                  return (
                    <tr key={e._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-green-100/60">{new Date(e.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-5 py-3 text-teal-300 font-medium">{fmt(e.assets)}</td>
                      <td className="px-5 py-3 text-red-400 font-medium">{fmt(e.liabilities)}</td>
                      <td className={`px-5 py-3 font-semibold ${eq >= 0 ? "text-green-300" : "text-red-400"}`}>{fmt(eq)}</td>
                      <td className={`px-5 py-3 font-semibold ${dr < 50 ? "text-green-300" : "text-amber-400"}`}>{dr}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

export default BalanceSheet;
