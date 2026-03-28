import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";

const lineData = [
  { month: "Oct", revenue: 42000, expenses: 28000 },
  { month: "Nov", revenue: 55000, expenses: 32000 },
  { month: "Dec", revenue: 48000, expenses: 30000 },
  { month: "Jan", revenue: 70000, expenses: 40000 },
  { month: "Feb", revenue: 65000, expenses: 37000 },
  { month: "Mar", revenue: 80000, expenses: 45000 },
];

const pieData = [
  { name: "Marketing", value: 25 },
  { name: "R&D", value: 30 },
  { name: "Operations", value: 20 },
  { name: "Investment", value: 15 },
  { name: "Other", value: 10 },
];

const barData = [
  { dept: "Marketing", spending: 25000 },
  { dept: "R&D", spending: 38000 },
  { dept: "Ops", spending: 20000 },
  { dept: "HR", spending: 15000 },
  { dept: "Sales", spending: 30000 },
];

const PIE_COLORS = ["#2dd4bf", "#4ade80", "#fbbf24", "#34d399", "#f472b6"];

const tooltipStyle = {
  backgroundColor: "rgba(0,40,30,0.85)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  color: "#f0fdf4",
  fontSize: "12px",
};

const ChartComponent = () => {
  const fmt = (v) => `₹${(v / 1000).toFixed(0)}k`;

  const panelStyle = {
    background: "rgba(0,40,30,0.45)",
    backdropFilter: "blur(12px)",
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="rounded-xl p-5 shadow-lg col-span-full lg:col-span-2 border border-white/10" style={panelStyle}>
        <h3 className="text-white font-semibold mb-1">Revenue vs Expenses</h3>
        <p className="text-green-200/60 text-xs mb-4">Last 6 months performance</p>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" tick={{ fill: "#a7f3d0", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fill: "#a7f3d0", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v.toLocaleString()}`, ""]} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#a7f3d0" }} />
            <Line type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={2.5} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} dot={false} name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="rounded-xl p-5 shadow-lg border border-white/10" style={panelStyle}>
        <h3 className="text-white font-semibold mb-1">Budget Allocation</h3>
        <p className="text-green-200/60 text-xs mb-4">Current distribution</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#a7f3d0" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl p-5 shadow-lg border border-white/10" style={panelStyle}>
        <h3 className="text-white font-semibold mb-1">Department Spending</h3>
        <p className="text-green-200/60 text-xs mb-4">Current period breakdown</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="dept" tick={{ fill: "#a7f3d0", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fill: "#a7f3d0", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v.toLocaleString()}`, "Spending"]} />
            <Bar dataKey="spending" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Spending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
