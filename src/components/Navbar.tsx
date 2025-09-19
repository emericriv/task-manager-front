import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-lg"
      style={{ height: "64px" }}
    >
      <div className="flex gap-6">
        {!isAuthenticated && (
          <>
            <Link to="/login" className="font-medium hover:underline">
              Login
            </Link>
            <Link to="/signup" className="ont-medium hover:underline">
              Inscription
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-6">
        <button
          className="rounded-full p-2 bg-white dark:bg-gray-700 shadow hover:scale-105 transition hover:cursor-pointer"
          onClick={toggleTheme}
          aria-label="Changer le thème"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {isAuthenticated && user && (
          <>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {user.username}
            </span>
            <button
              className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-600 dark:hover:bg-red-800 transition hover:cursor-pointer"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
