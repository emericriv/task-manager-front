import axios from "axios";
import { AxiosError } from "axios";
import type { Task } from "../models/tasks";
import type { User } from "../models/user";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    displayErrors(error);
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les réponses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si le statut est 401 et que ce n'est pas une tentative de refresh, on tente de rafraîchir le token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Appelle le endpoint de refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await apiClient.post("/token/refresh/", {
          refresh: refreshToken,
        });

        if (response.status === 200) {
          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;

          // Stocke le nouveau token
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Modifie le header Authorization et réessaye la requête initiale
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError: any) {
        if (error) {
          console.error(
            "API Error:",
            refreshError.response || refreshError.message
          );
        }
        // Si la tentative de refresh échoue, déconnecte l'utilisateur ou gère l'erreur

        return Promise.reject(refreshError);
      }
    }

    // Si c'est une autre erreur ou si le refresh échoue, rejette l'erreur
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string) {
  try {
    const response = await apiClient.post("/token/", {
      username,
      password,
    });
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return accessToken;
  } catch (error: any) {
    displayErrors(error as AxiosError);
  }
}

export async function register(
  username: string,
  password: string,
  email: string
) {
  try {
    const response = await apiClient.post("/register/", {
      username,
      password,
      email,
    });
    return response.data;
  } catch (error: any) {
    displayErrors(error as AxiosError);
  }
}

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("user/");
  return response.data;
};

export async function fetchTasks(): Promise<Task[]> {
  const res = await apiClient.get("/tasks/");
  return res.data;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await apiClient.post("/tasks/", task);
  return res.data;
}

export async function updateTask(
  id: number,
  task: Partial<Task>
): Promise<Task> {
  const res = await apiClient.put(`/tasks/${id}/`, task);
  return res.data;
}

export async function deleteTask(id: number): Promise<void> {
  await apiClient.delete(`/tasks/${id}/`);
}

const displayErrors = (error: AxiosError) => {
  if (error.response) {
    // Le serveur a répondu avec un statut différent de 2xx
    console.error("Erreur du serveur:", {
      code: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    console.error("Aucune réponse reçue:", error.request);
  } else {
    // Une erreur est survenue lors de la configuration de la requête
    console.error(
      "Erreur lors de la configuration de la requête:",
      error.message
    );
  }

  // console.error('Détails de l\'erreur:', error.config); // Afficher la configuration de la requête
  throw error; // Propager l'erreur pour la gestion des erreurs en aval
};
