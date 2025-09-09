"use client";

import type { Task } from "@/lib/api";

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <input
          aria-label="Toggle complete"
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </h3>
            {task.priority && (
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          {task.due_date && (
            <p className="text-xs text-gray-500 mt-1">
              Due: {new Date(task.due_date).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded px-2.5 py-1 text-sm border border-gray-300 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded px-2.5 py-1 text-sm border border-red-300 text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
