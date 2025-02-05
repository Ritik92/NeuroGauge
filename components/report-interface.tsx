// ReportInterface.tsx (updated career sections)
'use client'
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Target, Book, Users, Star, TrendingUp, MessageCircle, HeartPulse, Briefcase, GraduationCap, Microscope, Palette, Rocket, Code2 } from 'lucide-react';

const careerIconMap = {
  STEM: <Microscope className="w-6 h-6 text-purple-600" />,
  Arts: <Palette className="w-6 h-6 text-red-600" />,
  Business: <Briefcase className="w-6 h-6 text-blue-600" />,
  Technology: <Code2 className="w-6 h-6 text-green-600" />,
  Education: <GraduationCap className="w-6 h-6 text-yellow-600" />,
  Engineering: <Rocket className="w-6 h-6 text-orange-600" />
};

// Add this new component section
const CareerRecommendations = ({ bestCareer, suggestedCareers }:any) => (
  <>
    {/* Best Career Card */}
    <Card className="border-2 border-emerald-100 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
          <Rocket className="w-6 h-6 text-emerald-600" />
          <span>Top Career Match</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              {careerIconMap[bestCareer?.field] || <Briefcase className="w-6 h-6" />}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-emerald-800">{bestCareer?.title}</h3>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                {bestCareer?.field} Field
              </Badge>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {bestCareer.reason}
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>

    {/* Suggested Careers */}
    <Card className="border-2 border-purple-100 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
          <GraduationCap className="w-6 h-6 text-purple-600" />
          <span>Recommended Career Paths</span>
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
              className="p-4 bg-white border-2 border-purple-100 rounded-lg hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-purple-100 rounded-lg shrink-0">
                  {careerIconMap[career.field] || <Briefcase className="w-6 h-6" />}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-800">{career.title}</h4>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    {career.field}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {career.reason}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </>
);
const iconMap = {
  Book: <Book className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />
};

const ReportInterface = ({ demoData }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8"
    >
        <CareerRecommendations
        bestCareer={demoData.bestCareer} 
        suggestedCareers={demoData.suggestedCareers} 
      />

      {/* Header Section */}
      <header className="space-y-4">
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: shouldReduceMotion ? 0 : 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Brain className="w-8 h-8 text-blue-600 shrink-0" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Cognitive Assessment Report
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-100/50 hover:bg-blue-100">
            {demoData.studentInfo.name}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100/50 hover:bg-blue-100">
            {demoData.studentInfo.grade}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100/50 hover:bg-blue-100">
            {demoData.studentInfo.personalityType}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100/50 hover:bg-blue-100">
            {new Date(demoData.studentInfo?.assessmentDate).toLocaleDateString()}
          </Badge>
        </div>
      </header>

      {/* Cognitive Profile Section */}
      <Card className="border-2 border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-blue-600">
            Cognitive Profile
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Comprehensive analysis of cognitive abilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(demoData.cognitiveProfile).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : index * 0.1,
                duration: shouldReduceMotion ? 0 : 0.5
              }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium capitalize text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-600">
                  {value}%
                </span>
              </div>
              <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0 : 1, 
                    delay: shouldReduceMotion ? 0 : index * 0.1 
                  }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Style & Strengths */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <Star className="w-6 h-6 text-blue-600" />
              <span>Learning Style</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50/50 rounded-lg">
              <p className="font-semibold text-blue-600 sm:text-base">
                Primary: {demoData?.learningStyle?.primary}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Secondary: {demoData?.learningStyle?.secondary}
              </p>
            </div>
            <ul className="space-y-3">
              {demoData.learningStyle.characteristics.map((char, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: shouldReduceMotion ? 0 : index * 0.1,
                    duration: shouldReduceMotion ? 0 : 0.5
                  }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {char}
                  </span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span>Key Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoData.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: shouldReduceMotion ? 0 : index * 0.1,
                    duration: shouldReduceMotion ? 0 : 0.5
                  }}
                  className="p-4 bg-blue-50/50 rounded-lg space-y-2 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="font-semibold text-blue-600 sm:text-base">
                      {strength.title}
                    </span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
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
      <Card className="border-2 border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                  duration: shouldReduceMotion ? 0 : 0.3
                }}
                className="p-4 border-2 border-blue-100 rounded-lg hover:border-blue-300 bg-white transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-100 rounded-lg shrink-0">
                    {iconMap[rec.icon] || <Book className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 sm:text-base">
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
      <Card className="border-2 border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <HeartPulse className="w-6 h-6 text-blue-600" />
            <span>Development Areas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoData.developmentAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                  duration: shouldReduceMotion ? 0 : 0.5
                }}
                className="p-4 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <h4 className="font-semibold text-blue-600 sm:text-base text-center">
                  {area}
                </h4>
                <p className="text-sm text-gray-600 mt-2 text-center leading-relaxed">
                  Focused improvement strategies available
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportInterface;