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
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 py-8 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <Card className="bg-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Bulk Student Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50/50' 
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/30'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input {...getInputProps()} />
            <motion.div 
              animate={{ y: isDragActive ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FileUp className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                or click to select from your computer
              </p>
            </motion.div>
          </motion.div>

          {parsedData.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  Preview Data
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <TableCell>{row.firstName}</TableCell>
                          <TableCell>{row.lastName}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.dateOfBirth}</TableCell>
                          <TableCell>{row.grade}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Uploading... {progress}%
                  </p>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-6 font-medium text-lg hover:opacity-90 transition-opacity"
                >
                  {uploading ? `Processing Upload...` : 'Confirm Upload'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  </div>
  );
}