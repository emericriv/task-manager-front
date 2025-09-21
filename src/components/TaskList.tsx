import { useState, type JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, updateTask } from "../services/apiServices";
import type { Task } from "../models/tasks";
import TaskDetailsModal from "./TaskDetailsModal";

function formatDeadline(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) +
    " à " +
    d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
}

function SectionGrid({
  title,
  tasks,
  openDefault,
  renderTask,
}: {
  title: string;
  tasks: Task[];
  openDefault?: boolean;
  renderTask: (task: Task) => JSX.Element;
}) {
  const [open, setOpen] = useState(openDefault ?? true);
  return (
    <div className="mb-6">
      <div
        className={`flex items-center w-full cursor-pointer select-none px-2 py-3 border-b-2 transition-colors ${
          open
            ? "border-green-500 dark:border-green-400"
            : "border-gray-300 dark:border-gray-700"
        } bg-slate-50 dark:bg-slate-900 hover:bg-green-50 dark:hover:bg-slate-800`}
        onClick={() => setOpen((o) => !o)}
        title={open ? "Replier la section" : "Déplier la section"}
      >
        <span
          className={`mr-2 text-base transition-transform ${
            open ? "rotate-90" : ""
          } ${
            open
              ? "text-green-500 dark:text-green-400"
              : "text-gray-500 dark:text-gray-300"
          }`}
          style={{ display: "inline-block" }}
        >
          ▶
        </span>
        <span className="font-bold text-base flex-1 text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {tasks.length} tâche{tasks.length > 1 ? "s" : ""}
        </span>
      </div>
      {open && (
        <div
          className="grid gap-4 pt-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {tasks.length === 0 ? (
            <span className="text-gray-400">Aucune tâche</span>
          ) : (
            tasks.map((task) => renderTask(task))
          )}
        </div>
      )}
    </div>
  );
}

export default function TaskList() {
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const [modalTask, setModalTask] = useState<Task | null>(null);

  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const todos = tasks.filter((t) => t.status === "todo");
  const dones = tasks.filter((t) => t.status === "done");

  const handleStatusChange = (task: Task, newStatus: Task["status"]) => {
    updateMutation.mutate({
      id: task.id,
      updates: {
        ...task,
        status: newStatus,
      },
    });
  };

  const handleSaveDetails = (task: Task, updates: Partial<Task>) => {
    updateMutation.mutate({ id: task.id, updates });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
      <h2 className="text-lg font-bold mb-4 text-green-600">Mes tâches</h2>
      <SectionGrid
        title="En cours"
        tasks={inProgress}
        openDefault={true}
        renderTask={(task) => {
          const deadlinePassed =
            task.deadline && new Date(task.deadline) < new Date();
          return (
            <div
              key={task.id}
              className="relative min-w-[220px] max-w-xs w-full rounded-xl p-4 shadow flex flex-col justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              style={{ marginBottom: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full p-2 transition"
                onClick={() => setModalTask(task)}
                title="Détails"
              >
                <span className="sr-only">Détails</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                  />
                </svg>
              </button>
              <div className="mb-2">
                <div className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-100 break-words">
                  {task.title}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 break-words">
                  {task.description?.slice(0, 60)}
                  {task.description && task.description.length > 60
                    ? "..."
                    : ""}
                </div>
              </div>
              <div className="flex flex-row gap-2 mb-2">
                <button
                  className="flex items-center gap-1 bg-yellow-500 dark:bg-yellow-700 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600 dark:hover:bg-yellow-800 transition"
                  onClick={() => handleStatusChange(task, "todo")}
                  title="Marquer à faire"
                >
                  <span>⏳</span> À faire
                </button>
                <button
                  className="flex items-center gap-1 bg-green-500 dark:bg-green-700 text-white text-xs px-2 py-1 rounded hover:bg-green-600 dark:hover:bg-green-800 transition"
                  onClick={() => handleStatusChange(task, "done")}
                  title="Marquer terminée"
                >
                  <span>✔️</span> Terminée
                </button>
              </div>
              {task.deadline && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold mt-auto ${
                    deadlinePassed
                      ? "text-red-600 dark:text-red-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <span>🕒</span>
                  <span>{formatDeadline(task.deadline)}</span>
                  {deadlinePassed && <span className="ml-1">(dépassée)</span>}
                </div>
              )}
            </div>
          );
        }}
      />
      <SectionGrid
        title="À faire"
        tasks={todos}
        openDefault={true}
        renderTask={(task) => {
          const deadlinePassed =
            task.deadline && new Date(task.deadline) < new Date();
          return (
            <div
              key={task.id}
              className="relative min-w-[220px] max-w-xs w-full rounded-xl p-4 shadow flex flex-col justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              style={{ marginBottom: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full p-2 transition"
                onClick={() => setModalTask(task)}
                title="Détails"
              >
                <span className="sr-only">Détails</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                  />
                </svg>
              </button>
              <div className="mb-2">
                <div className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-100 break-words">
                  {task.title}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 break-words">
                  {task.description?.slice(0, 60)}
                  {task.description && task.description.length > 60
                    ? "..."
                    : ""}
                </div>
              </div>
              <div className="flex flex-row gap-2 mb-2">
                <button
                  className="flex items-center gap-1 bg-blue-500 dark:bg-blue-700 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition"
                  onClick={() => handleStatusChange(task, "in_progress")}
                  title="Marquer en cours"
                >
                  <span>🚧</span> En cours
                </button>
                <button
                  className="flex items-center gap-1 bg-green-500 dark:bg-green-700 text-white text-xs px-2 py-1 rounded hover:bg-green-600 dark:hover:bg-green-800 transition"
                  onClick={() => handleStatusChange(task, "done")}
                  title="Marquer terminée"
                >
                  <span>✔️</span> Terminée
                </button>
              </div>
              {task.deadline && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold mt-auto ${
                    deadlinePassed
                      ? "text-red-600 dark:text-red-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <span>🕒</span>
                  <span>{formatDeadline(task.deadline)}</span>
                  {deadlinePassed && <span className="ml-1">(dépassée)</span>}
                </div>
              )}
            </div>
          );
        }}
      />
      <SectionGrid
        title="Terminées"
        tasks={dones}
        openDefault={false}
        renderTask={(task) => (
          <div
            key={task.id}
            className="flex items-center justify-between px-2 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 line-through">
              {task.title}
            </span>
            <button
              className="ml-4 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full p-2 transition cursor-pointer"
              onClick={() => setModalTask(task)}
              title="Détails"
              style={{ minWidth: "36px" }}
            >
              <span className="sr-only">Détails</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                />
              </svg>
            </button>
          </div>
        )}
      />
      {modalTask && (
        <TaskDetailsModal
          task={modalTask}
          onClose={() => setModalTask(null)}
          onSave={(updates) => handleSaveDetails(modalTask, updates)}
        />
      )}
    </div>
  );
}
