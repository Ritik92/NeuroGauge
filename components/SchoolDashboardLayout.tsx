// app/dashboard/components/DashboardLayout.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { User } from '@prisma/client';

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
};

export function SchoolDashboardLayout({ user,school, children }: { user: any; school:any; children: any }) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      variants={variants}
      className="min-h-screen bg-muted/40"
    >
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">School Dashboard</h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <NavigationMenuLink href="/dashboard/school">
                      Home
                    </NavigationMenuLink>
                  </Button>
                  <Button variant="ghost" asChild>
                    <NavigationMenuLink href="/dashboard/school/addstudents">
                      Add Students
                    </NavigationMenuLink>
                  </Button>
                  {user.role === 'SCHOOL_ADMIN' && (
                    <>
                      <Button variant="ghost" asChild>
                        <NavigationMenuLink href={`/dashboard/school/${school.id}/reports`}>
                         Reports
                        </NavigationMenuLink>
                      </Button>
                      <Button variant="ghost" asChild>
                        <NavigationMenuLink href="/dashboard/school/studentlist">
                        Student List
                        </NavigationMenuLink>
                      </Button>
                    </>
                  )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {children}
        </div>
      </main>
    </motion.div>
  );
}