// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getUserTodosDb, run, all } from "@/lib/todosDb";
import { z } from "zod";

// Validation schema for creating todos
export const TodoCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueAt: z.string().optional(),
});

// GET /api/todos?sort=date|alpha
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getUserTodosDb(user.id);

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "date"; // default sort by creation date

    let rows;
    if (sort === "alpha") {
      rows = await all(db, "SELECT id, title, description, due_at as dueAt, created_at as createdAt, updated_at as updatedAt, completed FROM todos ORDER BY title ASC");
    } else {
      rows = await all(db, "SELECT id, title, description, due_at as dueAt, created_at as createdAt, updated_at as updatedAt, completed FROM todos ORDER BY created_at DESC");
    }

    return NextResponse.json({ todos: rows || [] });
  } catch (err) {
    console.error("GET /api/todos error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/todos
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = TodoCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { title, description, dueAt } = parsed.data;
    const db = getUserTodosDb(user.id);

    // Insert new todo
    const result = await run(
      db,
      "INSERT INTO todos (title, description, due_at) VALUES (?, ?, ?)",
      [title, description || null, dueAt || null]
    );

    // Fetch the newly created todo
    const rows = await all(db, "SELECT id, title, description, due_at as dueAt, created_at as createdAt, updated_at as updatedAt, completed FROM todos WHERE id = ?", [result.lastID]);
    const todo = rows[0] || null;

    return NextResponse.json({ todo });
  } catch (err) {
    console.error("POST /api/todos error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
