import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AuthSchema } from '../../../../lib/validation';
import { createUser, findUserByUsername } from '../../../../lib/db';
import { getUserTodosDb } from '../../../../lib/todosDb';
import { signToken, setAuthCookie } from '../../../../lib/auth';
import { ensureDirs } from '../../../../lib/paths';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = AuthSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { username, password } = parsed.data;
  const existing = await findUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  ensureDirs();
  const userId = await createUser(username, hash);
  // Create per-user todos DB
  getUserTodosDb(userId);
  const token = signToken({ id: userId, username });
  const res = NextResponse.json({ ok: true, user: { id: userId, username } });
  setAuthCookie(res, token);
  return res;
}
