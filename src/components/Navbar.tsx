import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-gray-100 shadow mb-4">
      <div className="flex gap-4">
        {!isAuthenticated && (
          <>
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600 font-medium">
              Inscription
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && user && (
          <>
            <span className="font-semibold text-gray-700">{user.username}</span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
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
