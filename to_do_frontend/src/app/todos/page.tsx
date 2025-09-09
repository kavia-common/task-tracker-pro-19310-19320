"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/apiClient";
import type { Todo } from "@/lib/types";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import Modal from "@/components/Modal";

export default function TodosPage() {
  const router = useRouter();
  const { state, getAccessToken } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  useEffect(() => {
    if (!state.loading && !state.user) {
      router.replace("/login");
    }
  }, [state.loading, state.user, router]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!state.user) return;
      try {
        const data = await api.listTodos(getAccessToken);
        if (!ignore) {
          setTodos(data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load todos";
        if (!ignore) setError(message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [state.user, getAccessToken]);

  const handleCreate = async (data: Parameters<typeof api.createTodo>[0]) => {
    const created = await api.createTodo(data, getAccessToken);
    setTodos((prev) => [created, ...prev]);
  };

  const handleToggle = async (id: string, next: boolean) => {
    const updated = await api.updateTodo(id, { completed: next }, getAccessToken);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleEditSubmit = async (data: { title: string; description?: string; priority: Todo["priority"]; dueDate?: string }) => {
    if (!editing) return;
    const updated = await api.updateTodo(
      editing.id,
      { title: data.title, description: data.description, priority: data.priority, dueDate: data.dueDate },
      getAccessToken
    );
    setTodos((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await api.deleteTodo(id, getAccessToken);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  if (state.loading || (!state.user && loading)) {
    return <main className="min-h-screen flex items-center justify-center">Loading...</main>;
  }

  if (!state.user) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My To-dos</h1>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="text-sm border rounded-md px-2 py-1.5 bg-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Add new task</h2>
          <TodoForm onSubmit={handleCreate} submitLabel="Add task" />
        </div>

        <div className="bg-white border rounded-lg p-4">
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded mb-3">{error}</div>}
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading tasks...</div>
          ) : (
            <TodoList
              todos={filtered}
              onToggle={handleToggle}
              onEdit={(t) => setEditing(t)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <Modal open={!!editing} title="Edit task" onClose={() => setEditing(null)}>
        {editing && (
          <TodoForm
            initial={editing}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditing(null)}
            submitLabel="Update"
          />
        )}
      </Modal>
    </main>
  );
}
