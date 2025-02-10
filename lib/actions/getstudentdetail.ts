'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function getStudentDetail(userId: string) {
    try {
        const student = await prisma.student.findUnique({
            where: {
                userId: userId,
            }       
        })

        if (!student) {
            return { error: 'Student not found' }
        }
        return { student }
    } catch (error) {
        console.error('Error fetching student details:', error)
        return { error: 'Failed to fetch student details' }
    }
}