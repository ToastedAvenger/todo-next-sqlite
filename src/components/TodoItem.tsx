'use client';
import { useState } from 'react';
import type { Todo } from '../app/dashboard/page';

export default function TodoItem({ todo, onToggleComplete, onDelete, onEdit }:{ todo: Todo; onToggleComplete:(t:Todo)=>void; onDelete:(id:number)=>void; onEdit:(id:number, payload: Partial<Todo>)=>void; }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [dueAt, setDueAt] = useState(() => todo.dueAt ? toLocalDatetime(todo.dueAt) : '');

  function toLocalDatetime(v: string) {
    // If already local "YYYY-MM-DDTHH:mm", keep it; else convert from ISO
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return v;
    const d = new Date(v);
    const pad = (n:number)=>n.toString().padStart(2,'0');
    const y=d.getFullYear(), m=pad(d.getMonth()+1), da=pad(d.getDate()), h=pad(d.getHours()), mi=pad(d.getMinutes());
    return `${y}-${m}-${da}T${h}:${mi}`;
  }

  function presentDue(v: string | null) {
    if (!v) return '—';
    try { return new Date(v).toLocaleString(); } catch { return v; }
  }

  return (
    <div className="todoItem">
      <input type="checkbox" checked={!!todo.completed} onChange={()=>onToggleComplete(todo)} />
      {!editing ? (
        <div>
          <div className="todoTitle">{todo.title}</div>
          <div className="todoMeta">{todo.description || 'No description'} • Due: {presentDue(todo.dueAt)} • Added: {new Date(todo.createdAt).toLocaleString()}</div>
        </div>
      ) : (
        <div className="row" style={{ flex: 1 }}>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
          <input type="datetime-local" className="datetime" value={dueAt} onChange={e=>setDueAt(e.target.value)} />
        </div>
      )}
      <div className="actions">
        {!editing ? (
          <>
            <button className="btn secondary" onClick={()=>setEditing(true)}>Edit</button>
            <button className="btn secondary" onClick={()=>onDelete(todo.id)}>Delete</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={()=>{ onEdit(todo.id, { title, description, dueAt: dueAt || null }); setEditing(false); }}>Save</button>
            <button className="btn secondary" onClick={()=>{ setEditing(false); setTitle(todo.title); setDescription(todo.description||''); setDueAt(todo.dueAt?toLocalDatetime(todo.dueAt):''); }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}