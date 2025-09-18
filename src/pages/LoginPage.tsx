import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access);
      navigate("/dashboard");
    },
  });

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Connexion..." : "Login"}
          </button>
          {mutation.isError && (
            <div className="text-red-500 mt-2">Erreur de connexion</div>
          )}
        </form>
        <div className="mt-4 text-center">
          <span>Pas encore inscrit ? </span>
          <button
            className="text-blue-600 underline"
            type="button"
            onClick={() => (window.location.href = "/signup")}
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}
