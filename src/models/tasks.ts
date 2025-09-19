export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  assignedTo?: number;
  deadline?: string; // format ISO, ex: "2025-09-18T18:00"
}
