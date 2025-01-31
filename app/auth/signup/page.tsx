'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'STUDENT' | 'PARENT' | 'SCHOOL_ADMIN'>('STUDENT')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    phone: '',
    // School admin specific fields
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    schoolId: '', // Only for student
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Prepare data based on role
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
      console.log(res)
      
      router.push('/auth')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: 'STUDENT' | 'PARENT' | 'SCHOOL_ADMIN') => setRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="PARENT">Parent</SelectItem>
                  <SelectItem value="SCHOOL_ADMIN">School Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            {role === 'STUDENT' && (
              <>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
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
                  />
                </div>

                <div>
                  <Label htmlFor="schoolId">School ID</Label>
                  <Input
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            {role === 'PARENT' && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {role === 'SCHOOL_ADMIN' && (
              <>
                <div>
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">School Address</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
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
                  />
                </div>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}