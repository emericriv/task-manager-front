import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/apiServices";
import type { Task } from "../../models/tasks";

export default function CreateTaskComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken") || "";

  const mutation = useMutation({
    mutationFn: () =>
      createTask(token, {
        title,
        description,
        deadline,
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setDescription("");
      setDeadline("");
      setStatus("todo");
    },
  });

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">Créer une tâche</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="flex flex-col gap-2"
      >
        <label className="text-sm font-medium">Titre</label>
        <input
          type="text"
          placeholder="Titre"
          className="border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="text-sm font-medium">Description</label>
        <textarea
          placeholder="Description"
          className="border px-2 py-1 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="text-sm font-medium">Deadline</label>
        <input
          type="datetime-local"
          className="border px-2 py-1 rounded"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <label className="text-sm font-medium">Statut</label>
        <select
          className="border px-2 py-1 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminée</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded mt-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
