'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Brain, BookOpen, FileText, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ParentDashboardLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const { scrollYProgress } = useScroll();
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(scrollYProgress, springConfig);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard/parent', icon: Brain },
    { name: 'Reports', href: '/dashboard/parent/reports', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
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
                Parent Portal
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
                    className="relative hover:text-blue-600"
                  >
                    <Link href={link.href} className="flex items-center space-x-2">
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
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
                    className="w-full justify-start my-1 hover:bg-blue-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={link.href} className="flex items-center space-x-2">
                      <link.icon className="h-5 w-5 mr-2" />
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
        </nav>
      </header>

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default ParentDashboardLayout;