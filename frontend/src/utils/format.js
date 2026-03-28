/**
 * Format Indian rupee values compactly.
 * e.g. 10000000 → ₹1Cr  | 500000 → ₹5L  | 5000 → ₹5,000
 */
export const fmt = (n = 0) => {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)}L`;
  return `₹${Number(n).toLocaleString("en-IN")}`;
};

/** Returns +X% or -X% coloured label */
export const pct = (invested, current) => {
  if (!invested || invested === 0) return "0%";
  const val = ((current - invested) / invested) * 100;
  return `${val >= 0 ? "+" : ""}${val.toFixed(1)}%`;
};

/** Map risk level to a colour token */
export const riskColor = (level) => {
  const map = { Low: "text-green-300", Medium: "text-yellow-300", High: "text-red-400" };
  return map[level] || "text-white";
};
