'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckSquare, School, GraduationCap, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Parent Portal</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/dashboard/parent" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="/dashboard/parent/reports" className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
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

const ChildCard = ({ child }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          {child.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Grade</p>
            <p className="font-medium">{child.grade}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">School</p>
            <p className="font-medium">{child.school}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-medium">{child.stats.totalAssessments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-medium">{child.stats.completedAssessments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="font-medium">{child.stats.pendingAssessments}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ParentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/parent/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {data.parent.name}
          </h2>
          {data.parent.phone && (
            <p className="text-gray-600">{data.parent.phone}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Children"
            value={data.stats.totalChildren}
            icon={Users}
          />
          <StatCard
            title="Total Assessments"
            value={data.stats.totalAssessments}
            icon={BookOpen}
          />
          <StatCard
            title="Completed"
            value={data.stats.completedAssessments}
            icon={CheckSquare}
          />
          <StatCard
            title="Schools"
            value={data.stats.schoolsCount}
            icon={School}
          />
        </div>

        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <GraduationCap className="mr-2" />
          Children's Progress
        </h3>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data.children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;