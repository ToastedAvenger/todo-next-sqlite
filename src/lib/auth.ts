import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'auth';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type JwtUser = { id: number; username: string };

export function signToken(user: JwtUser) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return jwt.sign({ sub: user.id, username: user.username }, secret, { expiresIn: MAX_AGE });
}

export function verifyToken(token: string | undefined): JwtUser | null {
  try {
    if (!token) return null;
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as any;
    return { id: decoded.sub as number, username: decoded.username as string };
  } catch {
    return null;
  }
}

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set({ name: COOKIE_NAME, value: '', maxAge: 0, path: '/' });
}

export function getUserFromRequest(req: NextRequest): JwtUser | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}