import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AuthSchema } from '../../../../lib/validation';
import { findUserByUsername } from '../../../../lib/db';
import { signToken, setAuthCookie } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = AuthSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { username, password } = parsed.data;
  const user = await findUserByUsername(username);
  if (!user) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });

  const token = signToken({ id: user.id, username: user.username });
  const res = NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
  setAuthCookie(res, token);
  return res;
}
