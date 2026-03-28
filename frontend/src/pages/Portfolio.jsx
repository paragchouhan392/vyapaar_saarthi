import { useState, useEffect } from "react";
import { getPortfolio, addPortfolio, deletePortfolio } from "../services/portfolioService";
import { fmt, pct } from "../utils/format";

const panelStyle = { background: "rgba(0,40,30,0.45)", backdropFilter: "blur(12px)" };

const EMPTY_FORM = { assetName: "", type: "Stock", amountInvested: "", currentValue: "" };

const inputCls =
  "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm";

const Badge = ({ type }) => {
  const bg = { Stock: "bg-teal-500/20 text-teal-300", Crypto: "bg-purple-500/20 text-purple-300", Bond: "bg-amber-500/20 text-amber-300" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium border border-white/10 ${bg[type] || ""}`}>{type}</span>;
};

const Portfolio = () => {
  const [items, setItems]       = useState([]);
  const [pagination, setPag]    = useState({});
  const [page, setPage]         = useState(1);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getPortfolio(p);
      setItems(res.data.data.items);
      setPag(res.data.data.pagination);
    } catch { setError("Failed to load portfolio."); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true); setError("");
    try {
      await addPortfolio({
        assetName:      form.assetName,
        type:           form.type,
        amountInvested: Number(form.amountInvested),
        currentValue:   Number(form.currentValue),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add asset.");
    } finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deletePortfolio(id); load(page); }
    catch { setError("Failed to delete item."); }
    finally { setDeleting(null); }
  };

  const totalInvested = items.reduce((s, i) => s + i.amountInvested, 0);
  const totalCurrent  = items.reduce((s, i) => s + i.currentValue, 0);
  const totalReturns  = totalCurrent - totalInvested;

  return (
    <div className="p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio</h2>
          <p className="text-green-200/60 text-sm mt-1">Track your investment assets</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Asset
        </button>
      </div>

      {error && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Invested",    value: fmt(totalInvested), color: "text-white" },
          { label: "Current Value",     value: fmt(totalCurrent),  color: "text-teal-300" },
          { label: "Total Returns",     value: fmt(totalReturns),  color: totalReturns >= 0 ? "text-green-300" : "text-red-400" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl p-5 border border-white/10 shadow-lg" style={panelStyle}>
            <p className="text-green-200/60 text-sm">{c.label}</p>
            <p className={`text-2xl font-bold mt-2 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Add Asset Form */}
      {showForm && (
        <div className="rounded-xl p-6 border border-teal-400/20 shadow-lg" style={panelStyle}>
          <h3 className="text-white font-semibold mb-4">Add New Asset</h3>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Asset Name *</label>
              <input className={inputCls} placeholder="e.g. Reliance Industries" value={form.assetName}
                onChange={e => setForm({...form, assetName: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Type *</label>
              <select className={inputCls} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="Stock">Stock</option>
                <option value="Crypto">Crypto</option>
                <option value="Bond">Bond</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Amount Invested (₹) *</label>
              <input className={inputCls} type="number" min="0" placeholder="0" value={form.amountInvested}
                onChange={e => setForm({...form, amountInvested: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Current Value (₹) *</label>
              <input className={inputCls} type="number" min="0" placeholder="0" value={form.currentValue}
                onChange={e => setForm({...form, currentValue: e.target.value})} required />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={adding}
                className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-all disabled:opacity-60">
                {adding ? "Adding…" : "Add Asset"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-lg text-sm border border-white/20 text-white/70 hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assets Table */}
      <div className="rounded-xl border border-white/10 shadow-lg overflow-hidden" style={panelStyle}>
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-semibold">Investment Assets</h3>
          <p className="text-green-200/50 text-xs mt-0.5">{pagination.total || 0} total assets</p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-green-200/50 text-sm">Loading portfolio…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-green-200/40 text-sm">No assets yet. Add your first investment above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-green-200/50 border-b border-white/10 text-left">
                  {["Asset", "Type", "Invested", "Current Value", "Returns", "P&L %", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => {
                  const ret  = item.currentValue - item.amountInvested;
                  const pctV = pct(item.amountInvested, item.currentValue);
                  return (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-white font-medium">{item.assetName}</td>
                      <td className="px-5 py-3"><Badge type={item.type} /></td>
                      <td className="px-5 py-3 text-green-100/70">{fmt(item.amountInvested)}</td>
                      <td className="px-5 py-3 text-teal-300 font-medium">{fmt(item.currentValue)}</td>
                      <td className={`px-5 py-3 font-semibold ${ret >= 0 ? "text-green-300" : "text-red-400"}`}>{fmt(ret)}</td>
                      <td className={`px-5 py-3 font-semibold ${pctV.startsWith("+") ? "text-green-300" : "text-red-400"}`}>{pctV}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-lg text-xs transition-all disabled:opacity-50"
                        >
                          {deleting === item._id ? "…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

export default Portfolio;
