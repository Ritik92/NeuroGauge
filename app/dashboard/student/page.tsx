'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, BookOpen, CheckSquare, UserSquare2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Student Portal</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/dashboard" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="/dashboard/student/assignments" className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Assignments
              </a>
              <a href="/dashboard/student/reports" className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Reports
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="rounded-full p-3 bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
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

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {stats.student.name}
          </h2>
          <p className="text-gray-600">Grade {stats.student.grade}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Assessments"
            value={stats.stats.completedAssessments}
            icon={CheckSquare}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {stats.schoolInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="mr-2 h-5 w-5" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{stats.schoolInfo.name}</p>
                <p className="text-gray-600">
                  {stats.schoolInfo.city}, {stats.schoolInfo.state}
                </p>
              </CardContent>
            </Card>
          )}

          {stats.parentInfo && stats.parentInfo.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserSquare2 className="mr-2 h-5 w-5" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.parentInfo.map((parent, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">
                      {parent.firstName} {parent.lastName}
                    </p>
                    {parent.phone && (
                      <p className="text-gray-600">{parent.phone}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;