import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <div className="w-full h-screen flex flex-col bg-slate-300 dark:bg-slate-900">
        <Navbar />
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute element={<DashboardPage />} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

