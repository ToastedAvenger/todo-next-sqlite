import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../lib/auth';
import { getUserTodosDb } from '../../../../lib/todosDb';
import { TodoUpdateSchema } from '../../../../lib/validation';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json();
  const parsed = TodoUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { title, description, dueAt, completed } = parsed.data;
  const db = getUserTodosDb(user.id);
  const existing = db.prepare('SELECT id FROM todos WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const fields: string[] = [];
  const args: any[] = [];
  if (title !== undefined) { fields.push('title = ?'); args.push(title); }
  if (description !== undefined) { fields.push('description = ?'); args.push(description); }
  if (dueAt !== undefined) { fields.push('due_at = ?'); args.push(dueAt); }
  if (completed !== undefined) { fields.push('completed = ?'); args.push(completed); }
  fields.push("updated_at = datetime('now')");
  const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
  args.push(id);
  db.prepare(sql).run(...args);
  const row = db.prepare('SELECT id, title, description, due_at as dueAt, created_at as createdAt, updated_at as updatedAt, completed FROM todos WHERE id = ?').get(id);
  return NextResponse.json({ todo: row });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const db = getUserTodosDb(user.id);
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}