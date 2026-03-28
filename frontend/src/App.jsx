import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages
import Home          from "./Home";
import Register      from "./Register";
import Login         from "./Login";

// Layout
import DashboardLayout from "./components/DashboardLayout";

// Dashboard pages
import Dashboard      from "./pages/Dashboard";
import Portfolio      from "./pages/Portfolio";
import BalanceSheet   from "./pages/BalanceSheet";
import InvestmentGuide from "./pages/InvestmentGuide";
import OrgProfile     from "./pages/OrgProfile";

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login"    element={<Login />} />

      {/* Protected dashboard — all nested under DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index                  element={<Dashboard />} />
        <Route path="portfolio"       element={<Portfolio />} />
        <Route path="balance"         element={<BalanceSheet />} />
        <Route path="investment-guide" element={<InvestmentGuide />} />
        <Route path="org-profile"     element={<OrgProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;