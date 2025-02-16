import { auth } from '@/auth.config';
import razorpay from '@/lib/razorpay';
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(session)
    const { studentCount } = await req.json();
    console.log(studentCount)
    const amount = studentCount * 100; // ₹100 per student
    const user=await prisma.user.findUnique({
        where:{
            email:session.user.email
        }
    })
    
    const school=await prisma.school.findUnique({
        where:{
            userId:user.id
        }
    })
    console.log(school)
   
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `${school.id}`,
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        amount,
        status: 'PENDING',
        razorpayOrderId: order.id,
        schoolId: school.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}