// lib/csvUtils.ts
import Papa from 'papaparse';

export async function parseCSV<T>(file: File): Promise<{ data: T[], errors: string[] }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors = results.errors.map(e => `Row ${e.row}: ${e.message}`);
        resolve({ data: results.data as T[], errors });
      }
    });
  });
}

export function validateStudentData(data: any[]): string[] {
  const errors: string[] = [];
  const requiredFields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'grade'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  data.forEach((row, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 1}: Missing ${field}`);
      }
    });

    // Validate email format
    if (row.email && !emailRegex.test(row.email)) {
      errors.push(`Row ${index + 1}: Invalid email format`);
    }

    // Validate grade
    const grade = parseInt(row.grade);
    if (isNaN(grade) || grade < 1 || grade > 12) {
      errors.push(`Row ${index + 1}: Grade must be between 1-12`);
    }
  });

  return errors;
}