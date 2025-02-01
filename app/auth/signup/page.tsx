'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { signIn } from 'next-auth/react'
import { Brain, User, School, Users } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('STUDENT')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    phone: '',
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    schoolId: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const signupData = {
      email: formData.email,
      password: formData.password,
      role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      ...(role === 'STUDENT' && {
        dateOfBirth: formData.dateOfBirth,
        grade: parseInt(formData.grade),
        schoolId: formData.schoolId,
      }),
      ...(role === 'PARENT' && {
        phone: formData.phone,
      }),
      ...(role === 'SCHOOL_ADMIN' && {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phone: formData.phone,
      }),
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      
      const res = await signIn('credentials', {
        email: signupData.email,
        password: signupData.password,
        redirect: false,
      })
      
      router.push('/auth')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const roleIcons = {
    STUDENT: <User className="w-5 h-5" />,
    PARENT: <Users className="w-5 h-5" />,
    SCHOOL_ADMIN: <School className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto relative">
        {/* Decorative elements */}
        <motion.div
          className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
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
          className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
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
          transition={{ duration: 0.8 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <motion.div 
                className="flex items-center justify-center space-x-2 mb-4"
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
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries({
                        STUDENT: 'Student',
                        PARENT: 'Parent',
                        SCHOOL_ADMIN: 'School Admin'
                      }).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center space-x-2">
                            {roleIcons[value]}
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Base fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm</Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Role-specific fields */}
                    {role === 'STUDENT' && (
                      <motion.div
                        key="student"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              required
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                              type="number"
                              name="grade"
                              value={formData.grade}
                              onChange={handleInputChange}
                              required
                              className="bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="schoolId">School ID</Label>
                          <Input
                            name="schoolId"
                            value={formData.schoolId}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    {role === 'PARENT' && (
                      <motion.div
                        key="parent"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-white"
                        />
                      </motion.div>
                    )}

                    {role === 'SCHOOL_ADMIN' && (
                      <motion.div
                        key="admin"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="name">School Name</Label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">School Address</Label>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

