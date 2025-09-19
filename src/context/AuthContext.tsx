import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchCurrentUser } from "../services/apiServices";
import type { User } from "../models/user";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  loginContext: () => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Récupérer les données de l'utilisateur
      fetchCurrentUser()
        .then((userData) => {
          console.log("Utilisateur récupéré :", userData);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error
          );
          setIsAuthenticated(false);
          setLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const loginContext = () => {
    fetchCurrentUser()
      .then((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
      })
      .catch(console.error);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await fetchCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error(
        "Erreur lors du rafraîchissement des données utilisateur :",
        error
      );
    }
  };

  return (
    !loading && (
      <AuthContext.Provider
        value={{ isAuthenticated, user, loginContext, logout, refreshUser }}
      >
        {children}
      </AuthContext.Provider>
    )
  );
};
