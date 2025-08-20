// lib/db.ts
import sqlite3 from "sqlite3";
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./paths";

const USERS_DB_PATH = path.join(DATA_DIR, "users.db");

declare global {
  // eslint-disable-next-line no-var
  var _usersDb: sqlite3.Database | undefined;
}

// --- Promise wrappers around sqlite3 callbacks ---
function run(
  db: sqlite3.Database,
  sql: string,
  params: any[] = []
): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get<T = any>(
  db: sqlite3.Database,
  sql: string,
  params: any[] = []
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) =>
      err ? reject(err) : resolve(row as T | undefined)
    );
  });
}

// --- Ensure singleton DB instance ---
export function getUsersDb() {
  if (!global._usersDb) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const db = new sqlite3.Database(USERS_DB_PATH);
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);
    });
    global._usersDb = db;
  }
  return global._usersDb!;
}

// --- User helpers ---
export async function findUserByUsername(username: string) {
  const db = getUsersDb();
  return await get<{ id: number; username: string; password_hash: string }>(
    db,
    "SELECT id, username, password_hash FROM users WHERE username = ?",
    [username]
  );
}

export async function createUser(username: string, password_hash: string) {
  const db = getUsersDb();
  const info = await run(
    db,
    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    [username, password_hash]
  );
  return info.lastID;
}

// --- ✅ Default export: database instance ---
export default getUsersDb();
