// ReportList.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { getStudentReports } from '@/lib/actions/report';
import { ReportList } from '@/components/student-report';
export default function ReportsPage() {
  return (
    <div className="container py-12 mx-12">
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              
                
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Reports
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            View and analyze your personalized assessment reports
          </p>
        </div>
        <ReportList />
      </motion.div>
    </div>
  );
}