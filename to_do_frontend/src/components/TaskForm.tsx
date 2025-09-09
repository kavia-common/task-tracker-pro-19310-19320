"use client";

import { useEffect, useMemo, useState } from "react";
import type { Task } from "@/lib/api";

export type TaskFormValues = {
  title: string;
  description?: string;
  completed?: boolean;
  due_date?: string | null;
  priority?: "low" | "medium" | "high";
};

export default function TaskForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  initial?: Partial<Task>;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<TaskFormValues["priority"]>(
    (initial?.priority as TaskFormValues["priority"]) ?? "medium"
  );
  const [dueDate, setDueDate] = useState<string | "">(
    initial?.due_date ? initial.due_date.slice(0, 16) : ""
  );
  const [completed, setCompleted] = useState<boolean>(!!initial?.completed);

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setPriority(
      ((initial?.priority as TaskFormValues["priority"]) ?? "medium") as TaskFormValues["priority"]
    );
    setDueDate(initial?.due_date ? initial.due_date.slice(0, 16) : "");
    setCompleted(!!initial?.completed);
  }, [initial]);

  const disabled = useMemo(() => title.trim().length === 0, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const payload: TaskFormValues = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      completed,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Add more details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TaskFormValues["priority"])
            }
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="datetime-local"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-2">
          <input
            id="completed"
            type="checkbox"
            className="h-4 w-4"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label htmlFor="completed" className="text-sm">
            Completed
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={disabled}
          className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
