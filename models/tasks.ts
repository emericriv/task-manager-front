export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  assignedTo?: number;
}
