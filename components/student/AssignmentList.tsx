// components/student/AssignmentList.tsx
'use client'

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Assignment {
  id: string
  title: string
  description: string
  type: 'PERSONALITY' | 'APTITUDE' | 'INTEREST' | 'LEARNING_STYLE'
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
}

export function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {assignments.map((assignment, index) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/student/assignments/${assignment.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <Badge variant={getVariantByType(assignment.type)}>
                    {formatType(assignment.type)}
                  </Badge>
                </div>
                <CardDescription>{assignment.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

function getVariantByType(type: Assignment['type']) {
  switch (type) {
    case 'PERSONALITY': return 'default'
    case 'APTITUDE': return 'secondary'
    case 'INTEREST': return 'destructive'
    case 'LEARNING_STYLE': return 'outline'
    default: return 'default'
  }
}

function formatType(type: string) {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ')
}