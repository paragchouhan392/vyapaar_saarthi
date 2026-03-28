import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect specifically to our backend port
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
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
          <button type="submit" className="bg-white text-black font-semibold py-3 rounded-lg mt-2">
            Login
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
