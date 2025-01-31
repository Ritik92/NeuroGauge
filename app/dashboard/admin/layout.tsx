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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-muted/40">{children}</main>
    </div>
  );
}