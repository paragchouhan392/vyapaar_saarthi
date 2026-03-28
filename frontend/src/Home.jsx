

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-green-900 via-teal-800 to-green-700 w-full">

      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center w-full px-4 md:px-12 py-5">
       <h1 className="text-xs font-medium">Vyapaar saarthi</h1>

        <div className="hidden md:flex gap-8 text-sm">
          <a href="#">Overview</a>
          <a href="#">Features</a>
          <a href="#">Integrations</a>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => navigate("/login")} className="hover:underline text-sm font-semibold">
            Log In
          </button>
          <button onClick={() => navigate("/register")} className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm">
            Register Now!!
          </button>
        </div>
      </nav>

      {/* 🔥 Hero Section */}
      <section className="text-center mt-16 w-full px-4 md:px-0">

        <p className="text-sm text-gray-200 mb-3">
          All in one small businesses auditing webapp
        </p>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Smart and simple <br /> Financial Auditing Webapp
        </h1>

      </section>

      {/* 📊 Feature Section */}
      <section className="mt-12 bg-black/30 rounded-t-3xl py-16 w-full px-4 md:px-12 text-center">

        <p className="text-sm text-green-300">Why FinFlow?</p>

        <h2 className="text-3xl font-bold mt-2">
          The only fintech app you'll ever need
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-12">

          <div>
            <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-white flex items-center justify-center">
  <img
    src="/finance-icon.png"
    alt="finance"
    className="w-6 h-6 object-contain"
  />
</div>
            <h3 className="mt-4 font-semibold">Real-Time Risk Analysis</h3>
            <p className="text-gray-400 text-sm mt-2">
              ML-based allocation for efficient resource management.

            </p>
          </div>

          <div>
             <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-white flex items-center justify-center">
  <img
    src="/finance-icon.png"
    alt="finance"
    className="w-6 h-6 object-contain"
  />
</div>
            <h3 className="mt-4 font-semibold">Real-Time Risk Analysis</h3>
            <p className="text-gray-400 text-sm mt-2">
             Track risks instantly with AI-powered predictions.
            </p>
          </div>

          <div>
             <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-white flex items-center justify-center">
  <img
    src="/finance-icon.png"
    alt="finance"
    className="w-6 h-6 object-contain"
  />
</div>
            <h3 className="mt-4 font-semibold">Auto Financial Planning</h3>
            <p className="text-gray-400 text-sm mt-2">
             Smart tools for effortless budgeting and planning.
            </p>
          </div>

          <div>
           <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-white flex items-center justify-center">
  <img
    src="/finance-icon.png"
    alt="finance"
    className="w-6 h-6 object-contain"
  />
</div>
            <h3 className="mt-4 font-semibold">Special feature</h3>
            <p className="text-gray-400 text-sm mt-2">
              Flexible and rewarding usage of GenAI.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;