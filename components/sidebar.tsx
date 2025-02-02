'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  School,
  FileText,
  ClipboardList,
  Brain,
  Menu,
  X,
  LogOut
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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-white"
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-8 h-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Brain className="w-6 h-6 text-blue-600" />
              </motion.div>
              <Brain className="w-6 h-6 text-blue-600 opacity-50 absolute inset-0 m-auto" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              NeuroGauge
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    'relative',
                    pathname === link.href 
                      ? 'text-blue-600'
                      : 'hover:text-blue-600'
                  )}
                >
                  <Link href={link.href} className="flex items-center space-x-2">
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                    {pathname === link.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        initial={false}
                      />
                    )}
                  </Link>
                </Button>
              </motion.div>
            ))}

            {/* Logout Button */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-2"
            >
              {links.map((link) => (
                <motion.div
                  key={link.name}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(
                      'w-full justify-start my-1',
                      pathname === link.href 
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-blue-50'
                    )}
                  >
                    <Link href={link.href} className="flex items-center space-x-2">
                      <link.icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}

              {/* Mobile Logout Button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start my-1 text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
