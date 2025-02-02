'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckSquare, School, UserSquare2, Brain
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/students/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error) return (
    <div className="text-red-500 text-center">Error: {error}</div>
  );

  if (!stats) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {stats.student.name}
          </h2>
        </div>
        <p className="text-gray-600">Grade {stats.student.grade}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Assessments"
          value={stats.stats.completedAssessments}
          icon={CheckSquare}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {stats.schoolInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <School className="mr-2 h-5 w-5 text-blue-600" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-900">{stats.schoolInfo.name}</p>
                <p className="text-gray-600">
                  {stats.schoolInfo.city}, {stats.schoolInfo.state}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stats.parentInfo && stats.parentInfo.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <UserSquare2 className="mr-2 h-5 w-5 text-blue-600" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.parentInfo.map((parent, index) => (
                  <div key={index} className={index !== 0 ? 'mt-4' : ''}>
                    <p className="font-semibold text-gray-900">
                      {parent.firstName} {parent.lastName}
                    </p>
                    {parent.phone && (
                      <p className="text-gray-600">{parent.phone}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;