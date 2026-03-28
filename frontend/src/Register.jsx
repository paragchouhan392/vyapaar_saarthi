import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { signup } from "./services/authService";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    revenue: "",
    marketingBudget: "",
    rndBudget: "",
    investment: "",
    debt: "",
    operatingCost: "",
    cashInHand: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await signup({
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        revenue: Number(formData.revenue),
        marketingBudget: Number(formData.marketingBudget) || 0,
        rndBudget: Number(formData.rndBudget) || 0,
        investment: Number(formData.investment) || 0,
        debt: Number(formData.debt) || 0,
        operatingCost: Number(formData.operatingCost) || 0,
        cashInHand: Number(formData.cashInHand) || 0,
      });

      if (res.data.success) {
        // ✅ Update context state so PrivateRoute lets us through
        login(res.data.data.token, res.data.data);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Matching the landing page: white/10 bg, white borders with teal focus
  const inputClass =
    "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm";
  const currencyInputClass =
    "w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm";

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-green-900 via-teal-800 to-green-700 w-full">

      {/* Page body */}
      <div className="flex justify-center px-4 py-10">
        <div className="bg-black/30 rounded-3xl p-8 md:p-10 w-full max-w-3xl backdrop-blur-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-200 mb-2">Join Vyapaar Saarthi</p>
            <h2 className="text-4xl font-bold leading-tight">Create your account</h2>
            <p className="text-gray-300 mt-2 text-sm">Start managing your finances with AI</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-xl mb-6 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Section 1: Account Details */}
            <div>
              <p className="text-sm text-teal-300 mb-1">Step 1</p>
              <h3 className="text-xl font-bold mb-4">Account Details</h3>
              <div className="grid md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Acme Corp"
                    className={inputClass}
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Company Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@acme.com"
                    className={inputClass}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className={inputClass}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Confirm Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className={inputClass}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                  />
                </div>

              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Section 2: Financial Details */}
            <div>
              <p className="text-sm text-teal-300 mb-1">Step 2</p>
              <h3 className="text-xl font-bold mb-4">Financial Details</h3>
              <div className="grid md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Current Revenue *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="revenue" placeholder="0" className={currencyInputClass} value={formData.revenue} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Marketing Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="marketingBudget" placeholder="0" className={currencyInputClass} value={formData.marketingBudget} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">R&D Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="rndBudget" placeholder="0" className={currencyInputClass} value={formData.rndBudget} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Current Investment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="investment" placeholder="0" className={currencyInputClass} value={formData.investment} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Current Debt</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="debt" placeholder="0" className={currencyInputClass} value={formData.debt} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-300 ml-1">Operating Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="operatingCost" placeholder="0" className={currencyInputClass} value={formData.operatingCost} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-gray-300 ml-1">Cash in Hand</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                    <input type="number" name="cashInHand" placeholder="0" className={currencyInputClass} value={formData.cashInHand} onChange={handleInputChange} />
                  </div>
                </div>

              </div>
            </div>

            {/* Submit — matches landing page's white button style */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3 rounded-lg text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-70 shadow-md"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-300 text-sm">
            Already have an account?{" "}
            <span
              className="text-white font-semibold underline cursor-pointer hover:text-gray-200 transition-colors"
              onClick={() => navigate("/login")}
            >
              Log In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
