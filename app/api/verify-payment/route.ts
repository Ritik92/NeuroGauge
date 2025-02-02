import { auth } from '@/auth.config';
import razorpay from '@/lib/razorpay';
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

import crypto from 'crypto';


export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    await prisma.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: 'SUCCESSFUL',
          razorpayPaymentId: razorpay_payment_id,
        },
      });
  
      // Update school status
      await prisma.school.update({
        where: { 
          id: school.id 
        },
        data: { 
          isActive: true 
        },
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Payment verification error:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 500 }
      );
    }
  }
  
 