import { z } from 'zod';

export const AuthSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_\-]+$/, 'Only letters, numbers, _ and -'),
  password: z.string().min(6).max(72)
});

export const TodoCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  dueAt: z.string().max(50).nullable().optional(),
});

export const TodoUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  dueAt: z.string().max(50).nullable().optional(),
  completed: z.union([z.literal(0), z.literal(1)]).optional(),
});