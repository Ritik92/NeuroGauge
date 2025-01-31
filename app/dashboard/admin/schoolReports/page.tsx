'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileBarChart, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSchoolReports } from '@/lib/actions/getSchoolReports';

// Report type icons mapping
const typeIcons = {
  CLASS_WISE: <BarChart3 className="w-5 h-5" />,
  GRADE_WISE: <PieChart className="w-5 h-5" />,
  SCHOOL_WIDE: <FileBarChart className="w-5 h-5" />,
  YEARLY: <TrendingUp className="w-5 h-5" />,
};

export default function SchoolReportListClient() {
  const [initialReports, setInitialReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getSchoolReports();
        setInitialReports(response);
      } catch (error) {
        console.error('Error fetching school reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = initialReports?.filter(report => {
    const matchesSearch = report.school.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || report.type === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FileBarChart className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">School Reports</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by school name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CLASS_WISE">Class-wise</SelectItem>
              <SelectItem value="GRADE_WISE">Grade-wise</SelectItem>
              <SelectItem value="SCHOOL_WIDE">School-wide</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredReports.map((report) => (
          <motion.div key={report.id} variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {typeIcons[report.type]}
                    <Badge variant="outline">{report.type.replace('_', ' ')}</Badge>
                  </div>
                  <Badge variant="secondary">
                    {formatDate(report.createdAt)}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{report.school.name}</CardTitle>
                <CardDescription>
                  {report.school.city}, {report.school.state}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Admin:</span>
                    <span>{report.school.adminFirstName} {report.school.adminLastName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Contact:</span>
                    <span>{report.school.phone}</span>
                  </div>
                  <motion.div
                    className="w-full h-1 bg-primary/10 mt-4 rounded-full overflow-hidden"
                    initial={false}
                  >
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500">No reports found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
}