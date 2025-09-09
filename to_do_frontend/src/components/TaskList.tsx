"use client";

import type { Task } from "@/lib/api";
import TaskItem from "@/components/TaskItem";

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  if (!tasks?.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
        No tasks yet. Add your first task!
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
