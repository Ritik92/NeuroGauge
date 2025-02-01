'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, User, Mail, Brain } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password', {
          style: {
            border: '1px solid #FF5A5F',
            padding: '16px',
            color: '#FF5A5F',
          },
          iconTheme: {
            primary: '#FF5A5F',
            secondary: '#FFFAEE',
          },
        });
        setLoading(false);
        return;
      }
      console.log(result)
      if (result?.ok) {
        toast.success('Successfully signed in!');
        router.push('/auth');
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
      setLoading(false);
    }
  };

  const inputClasses = "w-full p-4 bg-indigo-50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 outline-none text-gray-700";
  const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-indigo-50"
      >
        <motion.div 
          className="flex items-center justify-center mb-8 space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center"
          >
            <Brain className="w-8 h-8 text-blue-600" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NeuroGauge
          </span>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Mail className={iconClasses} size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClasses} pl-12`}
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <User className={iconClasses} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClasses} pl-12`}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-xl flex items-center justify-center space-x-3 ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            } text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl`}
            disabled={loading}
          >
            <span>{loading ? 'Processing...' : 'Sign In'}</span>
            {!loading && (
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={20} />
              </motion.div>
            )}
          </motion.button>

          <motion.p 
            className="text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-indigo-700 font-medium transition-colors underline decoration-transparent hover:decoration-current"
            >
              Create account
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;