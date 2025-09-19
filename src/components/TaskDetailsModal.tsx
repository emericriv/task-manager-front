import { useState } from "react";
import type { Task } from "../models/tasks";

interface Props {
  task: Task;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
}

export default function TaskDetailsModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.slice(0, 16) : ""
  );
  const [status, setStatus] = useState<Task["status"]>(task.status);

  // Gestion du clic en dehors de la modale
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      status,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 min-w-[500px] max-w-[96vw] w-[540px] relative border border-gray-200 dark:border-gray-700">
        <button
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-xl hover:text-blue-500 dark:hover:text-blue-400 transition hover:cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Détails de la tâche
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre
          </label>
          <input
            type="text"
            className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Deadline
          </label>
          <input
            type="datetime-local"
            className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Statut
          </label>
          <select
            className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
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
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
