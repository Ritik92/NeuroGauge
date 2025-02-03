// import { PrismaClient } from '@prisma/client'
// import { NextRequest, NextResponse } from 'next/server'

// const prisma = new PrismaClient()

// export async function GET(req: NextRequest) {
//   try {
    
//    const response=await prisma.assessment.findFirst({
//     where: {
//         id: 'cm6p9wmwu0000we28ehkcn31j',

//     },
//     include: {
//         questions: {
//             orderBy: { orderIndex: 'asc' }
//         },
       
//     }
//    })
//     return NextResponse.json()
//   } catch (error) {
//     console.error('Error fetching response :', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch ' },
//       { status: 500 }
//     )
//   }
// }