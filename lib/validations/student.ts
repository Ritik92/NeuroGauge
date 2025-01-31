// lib/validations/student.ts
import { z } from 'zod';

export const StudentCSVSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  grade: z.number().int().min(1).max(12)
});