import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email(),
  password: z
    .string()
    .min(6),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email(),
  password: z
    .string(),
});

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

export const taskQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum(['pending', 'done'])
    .optional(),
});
