'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Target, LineChart, ArrowRight, 
  GraduationCap, MenuIcon, X, ChevronDown 
} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Principal, Edison High School",
      image: "/doctor_female_2.jpg",
      quote: "NeuroGauge has transformed how we understand and support our students. The insights we've gained are invaluable.",
    },
    {
      name: "James Wilson",
      role: "School Counselor",
      image: "/doctor_male.jpg",
      quote: "The detailed reports help us identify student strengths and areas for growth with unprecedented accuracy.",
    },
    {
      name: "Lisa Chen",
      role: "Parent",
      image: "/doctor_female.jpg",
      quote: "Finally, we have clear insights into how our child learns best. This has been a game-changer for their education.",
    }
  ];

  const stats = [
    { value: "500+", label: "Schools Enrolled" },
    { value: "100k+", label: "Students Assessed" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "30%", label: "Average Improvement" }
  ];

  const features = [
    {
      icon: <Brain className="text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms provide deep insights into learning patterns and cognitive strengths"
    },
    {
      icon: <Target className="text-blue-600" />,
      title: "Personalized Assessment",
      description: "Tailored tests adapt to each student's unique responses and patterns"
    },
    {
      icon: <LineChart className="text-blue-600" />,
      title: "Comprehensive Reports",
      description: "Detailed analytics with actionable recommendations for improvement"
    }
  ];

  return (
    <div ref={targetRef} className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
  isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 md:h-20">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          NeuroGauge
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        {['Features', 'About', 'Testimonials', 'Contact'].map((item) => (
          <a
            key={item}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            href={`#${item.toLowerCase()}`}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Desktop CTA Buttons */}
      <div className="hidden md:flex space-x-4">
        <Link href="/auth/signin">
          <button className="px-6 py-2 rounded-full text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
            Login
          </button>
        </Link>
        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity">
          Register School
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="md:hidden bg-white border-t">
      <div className="px-4 py-4 space-y-4">
        {['Features', 'About', 'Testimonials', 'Contact'].map((item) => (
          <a
            key={item}
            className="block text-gray-600 hover:text-blue-600 transition-colors"
            href={`#${item.toLowerCase()}`}
          >
            {item}
          </a>
        ))}
        <div className="space-y-2">
          <button className="w-full px-6 py-2 rounded-full text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors">
            Login
          </button>
          <button className="w-full px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity">
            Register School
          </button>
        </div>
      </div>
    </div>
  )}
</nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 md:mb-6"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <Sparkles className="w-4 h-4 mr-1" />
              Trusted by 500+ Schools
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Unlock Your Students'
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mt-2">
              Full Potential
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Transform your school with AI-powered psychometric assessments that provide deep insights into each student's unique learning style.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base md:text-lg font-medium hover:opacity-90 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-blue-600 text-blue-600 text-base md:text-lg font-medium hover:bg-blue-50 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <GraduationCap className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Empower your institution with cutting-edge psychometric tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  {React.cloneElement(feature.icon, { className: "w-6 h-6" })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Educators Say</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of schools transforming student development
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 relative">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-500 rotate-45" />
                  <div className="flex flex-col md:flex-row items-center mb-4 md:mb-6">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover mb-4 md:mb-0 md:mr-4"
                    />
                    <div className="text-center md:text-left">
                      <h4 className="text-xl font-semibold">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-gray-600">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === activeTestimonial ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Join over 500 schools using NeuroGauge to unlock student potential
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Start Free Trial Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold">NeuroGauge</span>
              </div>
              <p className="text-gray-600">
                Empowering education through advanced psychometric analysis
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Documentation', 'Guides'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>© 2024 NeuroGauge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;