// components/sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  School,
  Users,
  FileText,
  ClipboardList
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

  return (
    <div className="h-screen w-64 border-r bg-background">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <Button
            key={link.name}
            asChild
            variant="ghost"
            className={cn(
              'w-full justify-start',
              pathname === link.href ? 'bg-accent' : ''
            )}
          >
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}