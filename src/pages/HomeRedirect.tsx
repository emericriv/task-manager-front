import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../../services/apiServices";

export default function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    // Vérifie le token en appelant l'API
    fetchTasks(token)
      .then(() => {
        console.log("Token valide, redirection vers le dashboard");
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        console.log("Token invalide, redirection vers la page de login");
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return null;
}
