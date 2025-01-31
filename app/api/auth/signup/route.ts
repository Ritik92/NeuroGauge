import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import * as z from 'zod'

const prisma = new PrismaClient()

// Base user schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'PARENT', 'SCHOOL_ADMIN']),
  firstName: z.string(),
  lastName: z.string(),
})

// Role-specific schemas
const studentSchema = userSchema.extend({
  role: z.literal('STUDENT'),
  dateOfBirth: z.string(),
  grade: z.number(),
  schoolId: z.string(),
})

const parentSchema = userSchema.extend({
  role: z.literal('PARENT'),
  phone: z.string().optional(),
})

const schoolSchema = userSchema.extend({
  role: z.literal('SCHOOL_ADMIN'),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  phone: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate based on role
    let validatedData
    switch (body.role) {
      case 'STUDENT':
        validatedData = studentSchema.parse(body)
        break
      case 'PARENT':
        validatedData = parentSchema.parse(body)
        break
      case 'SCHOOL_ADMIN':
        validatedData = schoolSchema.parse(body)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid role specified' },
          { status: 400 }
        )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    // const hashedPassword = await hash(validatedData.password, 10)

    // Create user with role-specific data
    const userData = {
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role,
    }

    const user = await prisma.$transaction(async (tx) => {
      // Create base user
      const newUser = await tx.user.create({
        data: userData
      })

      // Create role-specific profile
      switch (validatedData.role) {
        case 'STUDENT':
          await tx.student.create({
            data: {
              userId: newUser.id,
              firstName: validatedData.firstName,
              lastName: validatedData.lastName,
              dateOfBirth: new Date(validatedData.dateOfBirth),
              grade: validatedData.grade,
              schoolId: validatedData.schoolId,
            }
          })
          break

        case 'PARENT':
          await tx.parent.create({
            data: {
              userId: newUser.id,
              firstName: validatedData.firstName,
              lastName: validatedData.lastName,
              phone: validatedData.phone,
            }
          })
          break

        case 'SCHOOL_ADMIN':
          await tx.school.create({
            data: {
              userId: newUser.id,
              name: validatedData.name,
              address: validatedData.address,
              city: validatedData.city,
              state: validatedData.state,
              country: validatedData.country,
              phone: validatedData.phone,
              adminFirstName: validatedData.firstName,
              adminLastName: validatedData.lastName,
            }
          })
          break
      }

      return newUser
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: user.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}