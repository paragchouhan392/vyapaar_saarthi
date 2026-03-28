const Card = ({ label, value, icon, color, change }) => {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/10 hover:border-white/20"
      style={{ background: "rgba(0,40,30,0.45)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between">
        <p className="text-green-100/70 text-sm">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change && (
        <p className={`text-xs font-medium ${change.positive ? "text-teal-300" : "text-red-400"}`}>
          {change.positive ? "▲" : "▼"} {change.text}
        </p>
      )}
    </div>
  );
};

export default Card;
