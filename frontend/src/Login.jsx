import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { login as loginAPI } from "./services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await loginAPI(formData);
      if (res.data.success) {
        // ✅ Update context state (PrivateRoute reads this)
        login(res.data.data.token, res.data.data);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-green-900 via-teal-800 to-green-700 w-full flex items-center justify-center">
      <div className="bg-black/40 p-10 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 bg-white/10 rounded-lg outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 bg-white/10 rounded-lg outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}
            className="bg-white text-black font-semibold py-3 rounded-lg mt-2 hover:bg-gray-100 transition-all disabled:opacity-70">
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          New here? <span className="underline cursor-pointer" onClick={() => navigate("/register")}>Register Now</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
