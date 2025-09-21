import TaskList from "../components/TaskList";
import CreateTaskComponent from "../components/CreateTaskComponent";

export default function DashboardPage() {
  return (
    <div className="flex flex-row gap-8 w-full p-8">
      <div className="w-2/3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Tableau de bord des tâches
        </h1>
        <TaskList />
      </div>
      <div className="w-1/3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <CreateTaskComponent />
      </div>
    </div>
  );
}
