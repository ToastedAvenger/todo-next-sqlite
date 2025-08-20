import path from 'node:path';
import fs from 'node:fs';

export const DATA_DIR = path.join(process.cwd(), 'data');
export const TODOS_DIR = path.join(DATA_DIR, 'todos');

export function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(TODOS_DIR)) fs.mkdirSync(TODOS_DIR);
}