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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // deadline doit être null ou string ISO
    onSave({
      title,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Détails de la tâche</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="text-sm font-medium">Titre</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="text-sm font-medium">Description</label>
          <textarea
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
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
