// lib/validations/student.ts
import { z } from 'zod';

export const StudentCSVSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().refine((val) => {
    try {
      // Handle common date formats
      const date = new Date(val);
      
      // Check if the date is valid and not too far in the past or future
      const year = date.getFullYear();
      if (year < 1800 || year > new Date().getFullYear()) {
        return false;
      }
      
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, 'Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY'),
  grade: z.number().int().min(1).max(12)
});