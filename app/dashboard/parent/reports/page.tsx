'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getParentStudents, getStudentReportsForParent } from '@/lib/actions/parent';
import { Button } from '@/components/ui/moving-border';
import Link from 'next/link';
import { StudentsList } from '@/components/parent/studentlist';
export default function ParentReportsPage() {
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Students Reports</h1>
          <p className="text-muted-foreground">
            View assessment reports for all your children
          </p>
        </div>
        <StudentsList />
      </div>
    </div>
  );
}
