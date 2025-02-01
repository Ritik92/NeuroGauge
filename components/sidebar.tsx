// components/sidebar.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  School,
  Users,
  FileText,
  ClipboardList,
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const links = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'Schools', href: '/dashboard/admin/schools', icon: School },
  { name: 'Assessments', href: '/dashboard/admin/assessments', icon: ClipboardList },
  { name: 'Reports', href: '/dashboard/admin/schoolReports', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      className={cn(
        "h-screen border-r bg-white/80 backdrop-blur-sm relative transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-between border-b">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Brain className="w-6 h-6 text-blue-600" />
            </motion.div>
            <Brain className="w-6 h-6 text-blue-600 opacity-50" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NeuroGauge
            </span>
          )}
        </motion.div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-blue-50"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <motion.div
            key={link.name}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              variant="ghost"
              className={cn(
                'w-full justify-start transition-all duration-300',
                pathname === link.href 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                  : 'hover:bg-blue-50'
              )}
            >
              <Link href={link.href} className="flex items-center">
                <link.icon className={cn(
                  "h-5 w-5",
                  pathname === link.href ? 'text-blue-600' : 'text-gray-500'
                )} />
                {!isCollapsed && (
                  <span className="ml-3">{link.name}</span>
                )}
              </Link>
            </Button>
          </motion.div>
        ))}
      </nav>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />
    </motion.div>
  );
}