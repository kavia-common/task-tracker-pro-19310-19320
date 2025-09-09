"use client";

import React from "react";
import type { Todo } from "@/lib/types";

type Props = {
  todo: Todo;
  onToggle: (id: string, next: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  const badgeColor =
    todo.priority === "high"
      ? "bg-red-100 text-red-700"
      : todo.priority === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-white hover:shadow-sm transition">
      <input
        aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
        className="mt-1 h-5 w-5 accent-blue-600"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`text-base font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
            {todo.title}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>{todo.priority}</span>
          {todo.dueDate && (
            <span className="text-xs text-gray-500">Due {new Date(todo.dueDate).toLocaleDateString()}</span>
          )}
        </div>
        {todo.description && (
          <p className={`text-sm mt-1 ${todo.completed ? "text-gray-400 line-through" : "text-gray-600"}`}>
            {todo.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(todo)}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
          aria-label={`Edit ${todo.title}`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-sm px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
          aria-label={`Delete ${todo.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
