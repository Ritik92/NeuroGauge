'use client'
import { motion } from "framer-motion";
import { useRef } from "react";

export default function HomePage() {
  const constraintsRef = useRef(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Navbar */}
      <nav className="p-6 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl font-bold text-purple-800">PsychometricPro</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all">
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-6 py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-bold text-purple-900 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Unlock Your Potential
        </motion.h1>
        <motion.p
          className="text-xl text-gray-700 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Discover your strengths, explore career paths, and achieve your dreams with our advanced psychometric evaluation platform.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all">
            Take the Test
          </button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="container mx-auto px-6 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold text-purple-800 mb-4">Personalized Tests</h3>
            <p className="text-gray-700">
              Tailored psychometric tests designed to uncover your unique personality and interests.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold text-purple-800 mb-4">Detailed Reports</h3>
            <p className="text-gray-700">
              Comprehensive reports with actionable insights to guide your career and personal growth.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold text-purple-800 mb-4">School Collaboration</h3>
            <p className="text-gray-700">
              Collaborate with schools to provide aggregated reports and support student development.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="container mx-auto px-6 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-gray-700 italic mb-4">
              "This platform helped me understand my strengths and choose the right career path. Highly recommended!"
            </p>
            <p className="text-purple-800 font-bold">- John Doe</p>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-gray-700 italic mb-4">
              "As a parent, I found the reports incredibly insightful. It helped me guide my child better."
            </p>
            <p className="text-purple-800 font-bold">- Jane Smith</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 PsychometricPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}