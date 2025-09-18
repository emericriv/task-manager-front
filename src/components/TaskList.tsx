import { useState, type JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, updateTask } from "../../services/apiServices";
import type { Task } from "../../models/tasks";
import TaskDetailsModal from "./TaskDetailsModal";

function formatDeadline(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function Section({
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
    <div className="mb-4">
      <div
        className="flex items-center cursor-pointer select-none mb-2"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mr-2 text-lg">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-md">{title}</span>
      </div>
      {open && (
        <div className="flex gap-2 overflow-x-auto">
          {tasks.length === 0 ? (
            <span className="text-gray-400">Aucune tâche</span>
          ) : (
            tasks.map(renderTask)
          )}
        </div>
      )}
    </div>
  );
}

export default function TaskList() {
  const token = localStorage.getItem("accessToken") || "";
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(token),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
      updateTask(token, id, updates),
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
    <div className="h-full flex flex-col">
      <Section
        title="En cours"
        tasks={inProgress}
        openDefault={true}
        renderTask={(task) => (
          <div
            key={task.id}
            className="relative min-w-[180px] bg-yellow-100 rounded p-2 shadow mr-2 flex flex-col justify-between"
          >
            <div>
              <div className="font-bold text-sm mb-1">{task.title}</div>
              <div className="text-xs text-gray-700 mb-1">
                {task.description?.slice(0, 40)}
                {task.description && task.description.length > 40 ? "..." : ""}
              </div>
              {task.deadline && (
                <div className="text-xs text-red-500">
                  ⏰ {formatDeadline(task.deadline)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col gap-1">
                <button
                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                  onClick={() => handleStatusChange(task, "todo")}
                >
                  À faire
                </button>
                <button
                  className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                  onClick={() => handleStatusChange(task, "done")}
                >
                  Terminée
                </button>
              </div>
              <button
                className="ml-2 text-gray-600 text-xl"
                onClick={() => setModalTask(task)}
                title="Détails"
              >
                &#x22EE;
              </button>
            </div>
          </div>
        )}
      />
      <Section
        title="À faire"
        tasks={todos}
        openDefault={true}
        renderTask={(task) => (
          <div
            key={task.id}
            className="relative min-w-[180px] bg-blue-100 rounded p-2 shadow mr-2 flex flex-col justify-between"
          >
            <div>
              <div className="font-bold text-sm mb-1">{task.title}</div>
              <div className="text-xs text-gray-700 mb-1">
                {task.description?.slice(0, 40)}
                {task.description && task.description.length > 40 ? "..." : ""}
              </div>
              {task.deadline && (
                <div className="text-xs text-red-500">
                  ⏰ {formatDeadline(task.deadline)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col gap-1">
                <button
                  className="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
                  onClick={() => handleStatusChange(task, "in_progress")}
                >
                  En cours
                </button>
                <button
                  className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                  onClick={() => handleStatusChange(task, "done")}
                >
                  Terminée
                </button>
              </div>
              <button
                className="ml-2 text-gray-600 text-xl"
                onClick={() => setModalTask(task)}
                title="Détails"
              >
                &#x22EE;
              </button>
            </div>
          </div>
        )}
      />
      <Section
        title="Terminées"
        tasks={dones}
        openDefault={false}
        renderTask={(task) => (
          <div
            key={task.id}
            className="relative w-full bg-gray-100 rounded p-2 shadow mb-1 flex items-center justify-between"
          >
            <span className="font-semibold text-sm">{task.title}</span>
            <button
              className="ml-2 text-gray-600 text-xl"
              onClick={() => setModalTask(task)}
              title="Détails"
            >
              &#x22EE;
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
