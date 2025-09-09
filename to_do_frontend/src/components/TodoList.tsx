"use client";

import TodoItem from "./TodoItem";
import type { Todo } from "@/lib/types";

type Props = {
  todos: Todo[];
  onToggle: (id: string, next: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export default function TodoList({ todos, onToggle, onEdit, onDelete }: Props) {
  if (!todos.length) {
    return <div className="text-sm text-gray-500 text-center py-8">No tasks yet. Add your first to-do!</div>;
  }
  return (
    <div className="space-y-3">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
