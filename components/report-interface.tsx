'use client'
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Target, Book, Users, Star, TrendingUp, MessageCircle, HeartPulse, Briefcase, GraduationCap, Microscope, Palette, Rocket, Code2 } from 'lucide-react';
import { getStudentDetail } from '@/lib/actions/getstudentdetail';
import { useSession } from 'next-auth/react';

const careerIconMap = {
  STEM: <Microscope className="w-5 h-5 text-purple-600" />,
  Arts: <Palette className="w-5 h-5 text-red-600" />,
  Business: <Briefcase className="w-5 h-5 text-blue-600" />,
  Technology: <Code2 className="w-5 h-5 text-green-600" />,
  Education: <GraduationCap className="w-5 h-5 text-yellow-600" />,
  Engineering: <Rocket className="w-5 h-5 text-orange-600" />
};

const CareerRecommendations = ({ bestCareer, suggestedCareers }) => (
  <div className="space-y-6">
    {/* Best Career Card */}
    <Card className="border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Rocket className="w-5 h-5 text-emerald-600" />
          Top Career Match
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {careerIconMap[bestCareer?.field] || <Briefcase className="w-5 h-5" />}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-emerald-800">{bestCareer?.title}</h3>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 font-medium">
                {bestCareer?.field}
              </Badge>
              <p className="text-sm text-gray-600 leading-relaxed">
                {bestCareer.reason}
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>

    {/* Suggested Careers */}
    <Card className="border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          Alternative Career Paths
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {suggestedCareers.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white border border-purple-100 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  {careerIconMap[career.field] || <Briefcase className="w-5 h-5" />}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-900">{career.title}</h4>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    {career.field}
                  </Badge>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {career.reason}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const iconMap = {
  Book: <Book className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />
};

const ReportInterface =  ({ demoData ,student}) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Header Section */}
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: shouldReduceMotion ? 0 : 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Brain className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Cognitive Assessment
          </h1>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
            {student?.firstName}
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
           Grade  {student?.grade}
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
            {demoData.studentInfo.personalityType}
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
            {new Date(demoData.studentInfo?.assessmentDate).toLocaleDateString()}
          </Badge>
        </div>
      </header>

      <CareerRecommendations
        bestCareer={demoData.bestCareer} 
        suggestedCareers={demoData.suggestedCareers} 
      />

      {/* Cognitive Profile Section */}
      <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">
            Cognitive Profile
          </CardTitle>
          <CardDescription>
            Analysis of key cognitive abilities and traits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {Object.entries(demoData.cognitiveProfile).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {/* <span className="text-sm font-semibold text-blue-600">
                  {value}%
                </span> */}
              </div>
              <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Style & Strengths */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-blue-600" />
              Learning Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-700">
                Primary: {demoData?.learningStyle?.primary}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Secondary: {demoData?.learningStyle?.secondary}
              </p>
            </div>
            <ul className="space-y-3">
              {demoData.learningStyle.characteristics.map((char, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {char}
                  </span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoData.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  className="p-4 bg-blue-50 rounded-lg space-y-2 hover:bg-blue-100/50 transition-colors"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium text-blue-700">
                      {strength.title}
                    </span>
                    <Badge className="bg-blue-100 text-blue-700">
                      {strength.score}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {strength.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                className="p-4 border border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {iconMap[rec.icon] || <Book className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Areas */}
      <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            Development Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoData.developmentAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100/50 transition-colors text-center"
              >
                <h4 className="font-medium text-blue-700">
                  {area}
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Focused improvement strategies available
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
        </Card>

{/* Footer Section - Optional stats summary */}
<div className="mt-8 text-center text-sm text-gray-500">
  <p>Assessment completed on {new Date(demoData.studentInfo?.assessmentDate).toLocaleDateString()}</p>
  <p className="mt-1">This report is generated based on comprehensive cognitive evaluation data</p>
</div>
</motion.div>
);
};

export default ReportInterface;