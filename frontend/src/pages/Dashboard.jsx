import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import ChartComponent from "../components/ChartComponent";

const insights = [
  { type: "reduce",   text: "Reduce marketing budget by 15% — currently over-allocated vs revenue ratio." },
  { type: "increase", text: "Increase inventory investment — demand signals indicate a growth window." },
  { type: "maintain", text: "Maintain operational costs — currently within optimal efficiency range." },
  { type: "reduce",   text: "Reduce outstanding debt — high debt-to-revenue ratio detected." },
  { type: "increase", text: "Increase R&D budget — competitor analysis recommends 18% allocation." },
];

const insightColors = {
  reduce:   { dot: "bg-red-400",     badge: "bg-red-500/20 text-red-300 border-red-400/30",         label: "Reduce"   },
  increase: { dot: "bg-teal-300",    badge: "bg-teal-500/20 text-teal-200 border-teal-400/30",       label: "Increase" },
  maintain: { dot: "bg-yellow-300",  badge: "bg-yellow-400/20 text-yellow-200 border-yellow-400/30", label: "Maintain" },
};

const recentActivity = [
  { date: "28 Mar 2026", revenue: "₹80,000", expense: "₹45,000", profit: "₹35,000", status: "profit" },
  { date: "15 Mar 2026", revenue: "₹65,000", expense: "₹48,000", profit: "₹17,000", status: "profit" },
  { date: "01 Mar 2026", revenue: "₹70,000", expense: "₹72,000", profit: "-₹2,000",  status: "loss"   },
  { date: "20 Feb 2026", revenue: "₹55,000", expense: "₹37,000", profit: "₹18,000", status: "profit" },
  { date: "05 Feb 2026", revenue: "₹48,000", expense: "₹30,000", profit: "₹18,000", status: "profit" },
];

const fmt = (n) =>
  n >= 1_00_00_000
    ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
    : n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(1)}L`
    : `₹${n?.toLocaleString("en-IN") || 0}`;

const panelStyle = {
  background: "rgba(0,40,30,0.45)",
  backdropFilter: "blur(12px)",
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setUser(res.data.data);
      } catch (err) {
        console.error("Failed to load profile:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const totalExpenses = user
    ? (user.marketingBudget || 0) + (user.rndBudget || 0) + (user.operatingCost || 0)
    : 0;
  const netProfit = user ? (user.revenue || 0) - totalExpenses : 0;

  return (
    <div className="p-7 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-green-200/60 text-sm mt-1">Overview of your financial performance</p>
        </div>
        {user && (
          <div className="text-right">
            <p className="text-white font-medium">{user.companyName}</p>
            <p className="text-green-300/50 text-xs">{user.email}</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-5 h-28 animate-pulse border border-white/10"
              style={{ background: "rgba(0,40,30,0.35)" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            label="Total Revenue"
            value={fmt(user?.revenue)}
            color="bg-teal-400/20 text-teal-300"
            change={{ positive: true, text: "12% vs last month" }}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
          />
          <Card
            label="Total Expenses"
            value={fmt(totalExpenses)}
            color="bg-red-500/20 text-red-300"
            change={{ positive: false, text: "4% vs last month" }}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>}
          />
          <Card
            label="Net Profit"
            value={fmt(netProfit)}
            color={netProfit >= 0 ? "bg-green-400/20 text-green-300" : "bg-red-500/20 text-red-300"}
            change={{ positive: netProfit >= 0, text: `${netProfit >= 0 ? "Profitable" : "Loss"} period` }}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
          />
          <Card
            label="Cash in Hand"
            value={fmt(user?.cashInHand)}
            color="bg-white/10 text-white"
            change={{ positive: true, text: "Liquid reserves" }}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
          />
        </div>
      )}

      {/* Charts */}
      <ChartComponent />

      {/* AI Insights + Table Side by Side */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 rounded-xl p-5 shadow-lg border border-teal-400/20" style={panelStyle}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-400/20 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M21.17 8H12V2.83" /><path d="M3.95 6.95 12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Insights</h3>
              <p className="text-green-200/50 text-xs">Gemini-powered recommendations</p>
            </div>
          </div>
          <ul className="space-y-3">
            {insights.map((ins, i) => {
              const c = insightColors[ins.type];
              return (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                  <div className="flex-1">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${c.badge} mr-2`}>
                      {c.label}
                    </span>
                    <span className="text-green-100/80 text-xs">{ins.text}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-3 rounded-xl p-5 shadow-lg border border-white/10" style={panelStyle}>
          <h3 className="text-white font-semibold mb-1">Recent Activity</h3>
          <p className="text-green-200/50 text-xs mb-4">Latest financial entries</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-green-200/50 border-b border-white/10 text-left">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Expense</th>
                  <th className="pb-3 font-medium">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-green-100/60">{row.date}</td>
                    <td className="py-3 text-teal-300 font-medium">{row.revenue}</td>
                    <td className="py-3 text-red-400 font-medium">{row.expense}</td>
                    <td className={`py-3 font-semibold ${row.status === "profit" ? "text-green-300" : "text-red-400"}`}>
                      {row.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
