// lib/todosDb.ts
import sqlite3 from 'sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { TODOS_DIR } from './paths';

declare global {
  // eslint-disable-next-line no-var
  var _todoDbs: Map<number, sqlite3.Database> | undefined;
}

function run(db: sqlite3.Database, sql: string, params: any[] = []) {
  return new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function all<T = any>(db: sqlite3.Database, sql: string, params: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows as T[])));
  });
}

export function get<T = any>(db: sqlite3.Database, sql: string, params: any[] = []) {
  return new Promise<T | undefined>((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row as T | undefined)));
  });
}

export function getUserTodosDb(userId: number) {
  if (!global._todoDbs) global._todoDbs = new Map();
  const cached = global._todoDbs.get(userId);
  if (cached) return cached;

  if (!fs.existsSync(TODOS_DIR)) fs.mkdirSync(TODOS_DIR, { recursive: true });
  const file = path.join(TODOS_DIR, `user_${userId}.db`);
  const db = new sqlite3.Database(file);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      due_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      completed INTEGER DEFAULT 0
    )`);
  });

  global._todoDbs.set(userId, db);
  return db;
}

export { run };
