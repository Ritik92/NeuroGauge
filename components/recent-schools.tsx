// components/recent-schools.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileBarChart, BarChart3, PieChart, TrendingUp, Brain, BookOpen, Lightbulb, PenTool } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';

// Shared animations
const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Shared loading spinner
const LoadingSpinner = ({ icon: Icon }) => (
  <div className="flex justify-center items-center min-h-[400px]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className="text-blue-600"
    >
      <Icon className="w-8 h-8" />
    </motion.div>
  </div>
);

// Modern SearchBar component
const SearchBar = ({ value, onChange, placeholder }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative flex-1"
  >
    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    <Input
      placeholder={placeholder}
      className="pl-10 border-blue-100 focus:border-blue-300 transition-colors"
      value={value}
      onChange={onChange}
    />
  </motion.div>
);

// RecentSchools Component
export const RecentSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('/api/admin/recent-schools');
        setSchools(response.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) return <LoadingSpinner icon={Brain} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-white">Recently Added Schools</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <motion.tr
                  key={school.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.city}, {school.state}</TableCell>
                  <TableCell>{new Date(school.createdAt).toLocaleDateString()}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};