"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import Protected from "@/components/Protected";
import TaskList from "@/components/TaskList";
import TaskForm, { type TaskFormValues } from "@/components/TaskForm";
import {
  apiCreateTask,
  apiDeleteTask,
  apiGetTasks,
  apiToggleTaskComplete,
  apiUpdateTask,
  type Task,
} from "@/lib/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return tasks;
    const q = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const load = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetTasks();
      setTasks(data);
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Failed to load tasks");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (values: TaskFormValues): Promise<void> => {
    setCreating(true);
    try {
      const created = await apiCreateTask(values);
      setTasks((prev) => [created, ...prev]);
      setEditing(null);
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Create failed");
      alert(msg);
    } finally {
      setCreating(false);
    }
  };

  const onUpdate = async (values: TaskFormValues): Promise<void> => {
    if (!editing) return;
    try {
      const updated = await apiUpdateTask(editing.id, values);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Update failed");
      alert(msg);
    }
  };

  const onToggle = async (t: Task): Promise<void> => {
    try {
      const toggled = await apiToggleTaskComplete(t.id);
      setTasks((prev) => prev.map((x) => (x.id === t.id ? toggled : x)));
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Toggle failed");
      alert(msg);
    }
  };

  const onDelete = async (t: Task): Promise<void> => {
    if (!confirm("Delete this task?")) return;
    try {
      await apiDeleteTask(t.id);
      setTasks((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Delete failed");
      alert(msg);
    }
  };

  return (
    <Protected>
      <PageShell>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Your Tasks</h1>
          <div className="flex gap-2">
            <input
              placeholder="Search tasks..."
              className="rounded border border-gray-300 px-3 py-2 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-medium mb-3">{editing ? "Edit task" : "Add a new task"}</h2>
            <TaskForm
              initial={editing ?? undefined}
              onSubmit={editing ? onUpdate : onCreate}
              onCancel={editing ? () => setEditing(null) : undefined}
              submitLabel={creating ? "Saving..." : "Save"}
            />
          </section>

          <section className="grid gap-3">
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
                Loading tasks...
              </div>
            ) : (
              <TaskList tasks={filtered} onToggle={onToggle} onEdit={setEditing} onDelete={onDelete} />
            )}
          </section>
        </div>
      </PageShell>
    </Protected>
  );
}
