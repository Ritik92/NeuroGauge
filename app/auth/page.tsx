'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Shield, School, User, Users } from 'lucide-react'
import { auth } from '@/auth.config'
import { useSession } from 'next-auth/react'

export default  function AuthRouter() {
  const router = useRouter()
const {data:session}=useSession();
  const roleConfigs = {
    SYSTEM_ADMIN: {
      path: '/dashboard/admin',
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      label: 'System Administrator'
    },
    SCHOOL_ADMIN: {
      path: '/dashboard/school',
      icon: <School className="w-12 h-12 text-blue-600" />,
      label: 'School Administrator'
    },
    STUDENT: {
      path: '/dashboard/student',
      icon: <User className="w-12 h-12 text-blue-600" />,
      label: 'Student'
    },
    PARENT: {
      path: '/dashboard/parent',
      icon: <Users className="w-12 h-12 text-blue-600" />,
      label: 'Parent'
    }
  }

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const roleConfig = roleConfigs[session.user.role]
    if (roleConfig) {
      // Add a small delay for the animation to play
      const timeout = setTimeout(() => {
        router.push(roleConfig.path)
      }, 2000)
      
      return () => clearTimeout(timeout)
    }
  }, [session, router])

  if (!session) {
    return null
  }

  const roleConfig = roleConfigs[session.user.role]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 flex items-center justify-center p-8">
      <div className="relative">
        {/* Decorative background elements */}
        <motion.div
          className="absolute -z-10 -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -z-10 -bottom-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center max-w-md mx-auto"
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Brain className="w-8 h-8 text-blue-600" />
              </motion.div>
              <Brain className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NeuroGauge
            </span>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                className="p-4 rounded-full bg-blue-50"
              >
                {roleConfig.icon}
              </motion.div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {session.user?.name || session.user.email}
              </h1>
              <p className="text-gray-600">
                Accessing your {roleConfig.label} dashboard
              </p>
            </div>

            {/* Loading Animation */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
              className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500"
            >
              Please wait while we prepare your dashboard...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}