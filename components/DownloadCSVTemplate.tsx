// components/DownloadCSVTemplate.tsx
'use client';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';

const csvTemplate = `firstName,lastName,email,dateOfBirth,grade
John,Doe,john.doe@school.edu,2005-03-15,9
Jane,Smith,jane.smith@school.edu,2006-07-22,8`;

export function DownloadCSVTemplate() {
  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'student_template.csv');
  };

  return (
    <Button variant="outline" onClick={downloadTemplate}>
      Download CSV Template
    </Button>
  );
}