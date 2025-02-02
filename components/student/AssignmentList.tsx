'use client'

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface Assignment {
  id: string
  title: string
  description: string
  type: 'PERSONALITY' | 'APTITUDE' | 'INTEREST' | 'LEARNING_STYLE'
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  completed?: boolean
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  const getTypeIcon = (type: Assignment['type']) => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case 'PERSONALITY': return '🧠'
      case 'APTITUDE': return '🎯'
      case 'INTEREST': return '⭐'
      case 'LEARNING_STYLE': return '📚'
      default: return '📝'
    }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {assignments.map((assignment) => (
        <motion.div
          key={assignment.id}
          variants={item}
          className="group"
        >
          <Link href={`/dashboard/student/assignments/${assignment.id}`}>
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-100">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl" role="img" aria-label={assignment.type}>
                    {getTypeIcon(assignment.type)}
                  </span>
                  
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {assignment.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {assignment.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4">
                <div className="flex justify-between items-center w-full">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${getColorByType(assignment.type)}
                      transition-colors
                    `}
                  >
                    {formatType(assignment.type)}
                  </Badge>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-blue-600"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

function getColorByType(type: Assignment['type']) {
  switch (type) {
    case 'PERSONALITY': return 'text-purple-600 border-purple-200'
    case 'APTITUDE': return 'text-blue-600 border-blue-200'
    case 'INTEREST': return 'text-orange-600 border-orange-200'
    case 'LEARNING_STYLE': return 'text-green-600 border-green-200'
    default: return 'text-gray-600 border-gray-200'
  }
}

function formatType(type: string) {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ')
}