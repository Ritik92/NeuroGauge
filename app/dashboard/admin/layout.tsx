import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
import { Sidebar } from '@/components/sidebar';


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pt-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="py-6">
          {children}
        </div>
      </main>
    </div>
  );
}