import axios from "axios";
import { AxiosError } from "axios";
import type { Task } from "../models/tasks";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export async function fetchTasks(token: string): Promise<Task[]> {
  const res = await apiClient.get("/tasks/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createTask(
  token: string,
  task: Partial<Task>
): Promise<Task> {
  const res = await apiClient.post("/tasks/", task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateTask(
  token: string,
  id: number,
  task: Partial<Task>
): Promise<Task> {
  const res = await apiClient.put(`/tasks/${id}/`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteTask(token: string, id: number): Promise<void> {
  await apiClient.delete(`$/tasks/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
