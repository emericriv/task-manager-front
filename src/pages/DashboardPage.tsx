import TaskList from "../components/TaskList";
import CreateTaskComponent from "../components/CreateTaskComponent";

export default function DashboardPage() {
  return (
    <div className="p-6 h-screen flex gap-6">
      <div className="w-[70%] h-full">
        <h1 className="text-2xl font-bold mb-4">Tasks Dashboard</h1>
        <TaskList />
      </div>
      <div className="w-[30%] h-full">
        <CreateTaskComponent />
      </div>
    </div>
  );
}
