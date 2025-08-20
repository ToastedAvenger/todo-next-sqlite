'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SortFilterBar from '../../components/SortFilterBar';
import TodoItem from '../../components/TodoItem';

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
  completed: number;
};

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState<string>('');
  const [sort, setSort] = useState('created_desc');
  const [q, setQ] = useState('');
  const [errors, setErrors] = useState<{ title?: boolean; description?: boolean; due?: boolean }>({});
  const router = useRouter();

  // Fetch todos from backend
  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch('/api/todos');
      if (res.status === 401) { router.push('/'); return; }
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTodos(); }, []);

  // Filter and sort todos locally
  const filteredTodos = useMemo(() => {
    let temp = [...todos];

    if (q.trim()) {
      temp = temp.filter(todo =>
        todo.title.toLowerCase().includes(q.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(q.toLowerCase()) ?? false)
      );
    }

    temp.sort((a, b) => {
      switch (sort) {
        case 'created_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'created_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'alpha_asc': return a.title.localeCompare(b.title);
        case 'alpha_desc': return b.title.localeCompare(a.title);
        case 'due_asc':
          if (!a.dueAt) return 1;
          if (!b.dueAt) return -1;
          return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
        case 'due_desc':
          if (!a.dueAt) return 1;
          if (!b.dueAt) return -1;
          return new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime();
        default: return 0;
      }
    });

    return temp;
  }, [todos, q, sort]);

  // Add a new todo
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();

    // Check for empty fields
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = true;
    if (!description.trim()) newErrors.description = true;
    if (!due.trim()) newErrors.due = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || null, dueAt: due || null })
      });
      if (res.ok) {
        setTitle(''); setDescription(''); setDue('');
        setErrors({});
        fetchTodos();
      }
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  }

  async function onToggleComplete(t: Todo) {
    try {
      await fetch(`/api/todos/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: t.completed ? 0 : 1 })
      });
      fetchTodos();
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  }

  async function onDelete(id: number) {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  }

  async function onEdit(id: number, payload: Partial<Todo>) {
    try {
      await fetch(`/api/todos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      fetchTodos();
    } catch (err) {
      console.error('Failed to edit todo:', err);
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Your To‑Dos</h2>
        <form className="row" onSubmit={(e) => { e.preventDefault(); fetch('/api/auth/logout', { method: 'POST' }).then(()=>location.href='/'); }}>
          <button className="btn secondary" type="submit">Logout</button>
        </form>
      </div>

      <div className="separator" />

      <form onSubmit={addTodo} className="row" style={{ alignItems: 'flex-end' }}>
        <div style={{ flex: 2, minWidth: 220 }}>
          <div className="label">Title *</div>
          <input
            className={`input ${errors.title ? 'input-error' : ''}`}
            value={title}
            onChange={e=>{ setTitle(e.target.value); if(errors.title) setErrors({...errors, title:false}); }}
            placeholder="e.g., Submit assignment"
          />
        </div>
        <div style={{ flex: 3, minWidth: 280 }}>
          <div className="label">Description</div>
          <input
            className={`input ${errors.description ? 'input-error' : ''}`}
            value={description}
            onChange={e=>{ setDescription(e.target.value); if(errors.description) setErrors({...errors, description:false}); }}
            placeholder="Optional details"
          />
        </div>
        <div style={{ minWidth: 220 }}>
          <div className="label">Due</div>
          <input
            type="datetime-local"
            className={`datetime ${errors.due ? 'input-error' : ''}`}
            value={due}
            onChange={e=>{ setDue(e.target.value); if(errors.due) setErrors({...errors, due:false}); }}
          />
        </div>
        <button className="btn" type="submit">Add</button>
      </form>

      <div className="separator" />

      <SortFilterBar sort={sort} setSort={setSort} q={q} setQ={setQ} />

      {loading ? <p>Loading…</p> : (
        <div className="list">
          {filteredTodos.map(t => (
            <TodoItem key={t.id} todo={t} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
          ))}
          {filteredTodos.length === 0 && <p style={{ color: 'var(--muted)' }}>No to‑dos yet.</p>}
        </div>
      )}
    </div>
  );
}
