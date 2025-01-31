// components/StudentBulkUpload.tsx
'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { parseCSV, validateStudentData } from '@/lib/csvUtils';
import axios from 'axios';
import { motion } from 'framer-motion';

interface CSVRow {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  grade: string;
}

export function StudentBulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    try {
      const { data, errors } = await parseCSV<CSVRow>(file);
      
      if (errors.length > 0) {
        toast.error('CSV validation errors', {
          description: `${errors.length} errors found in CSV file`
        });
        return;
      }

      const validationErrors = validateStudentData(data);
      if (validationErrors.length > 0) {
        toast.error('Validation failed', {
          description: validationErrors.join(', ')
        });
        return;
      }

      setParsedData(data);
    } catch (error) {
      toast.error('Error parsing CSV');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleUpload = async () => {
    setUploading(true);
    try {
      const response = await axios.post('/api/students/bulkupload', parsedData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        }
      });

      if (response.data.success) {
        toast.success('Upload successful', {
          description: `${response.data.createdCount} students created`
        });
        setParsedData([]);
      }
    } catch (error) {
      toast.error('Upload failed', {
        description: error.response?.data?.message || 'An error occurred'
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Bulk Student Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center 
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground'}`}>
            <input {...getInputProps()} />
            <p>{isDragActive ? 'Drop CSV here' : 'Drag & drop CSV file, or click to select'}</p>
            <p className="text-sm text-muted-foreground mt-2">CSV format: firstName, lastName, email, dateOfBirth, grade</p>
          </div>

          {parsedData.length > 0 && (
            <div className="mt-6">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Preview (First 5 Rows)</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.firstName}</TableCell>
                          <TableCell>{row.lastName}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.dateOfBirth}</TableCell>
                          <TableCell>{row.grade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {uploading && <Progress value={progress} className="h-2 mb-4" />}

              <Button 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? `Uploading... ${progress}%` : 'Confirm Upload'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}