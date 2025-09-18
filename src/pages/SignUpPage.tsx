import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/apiServices";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async () => {
      register(username, password, email);
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Inscription</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="mb-4">
            <label className="block mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Inscription..." : "S'inscrire"}
          </button>
          {mutation.isError && (
            <div className="text-red-500 mt-2">
              Erreur lors de l'inscription
            </div>
          )}
        </form>
        <div className="mt-4 text-center">
          <span>Déjà inscrit ? </span>
          <button
            className="text-blue-600 underline"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}
