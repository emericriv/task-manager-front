import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../services/apiServices";
import type { Task } from "../models/tasks";

export default function CreateTaskComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createTask({
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
        Créer une tâche
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="flex flex-col gap-2"
      >
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Titre
        </label>
        <input
          type="text"
          placeholder="Titre"
          className="border border-gray-200 dark:border-gray-700 px-2 py-1 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          placeholder="Description"
          className="border border-gray-200 dark:border-gray-700 px-2 py-1 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Deadline
        </label>
        <input
          type="datetime-local"
          className="border border-gray-200 dark:border-gray-700 px-2 py-1 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Statut
        </label>
        <select
          className="border border-gray-200 dark:border-gray-700 px-2 py-1 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminée</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 dark:bg-blue-700 text-white py-2 rounded mt-2 hover:bg-blue-700 dark:hover:bg-blue-800 transition hover:cursor-pointer"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
