import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Brain, School, File, Users, ArrowRight } from 'lucide-react';
export const StatCard = ({ number, label }) => (
    <motion.div
      variants={fadeIn}
      className="p-6"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h4 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{number}</h4>
        <p className="text-gray-600 text-lg">{label}</p>
      </motion.div>
    </motion.div>
  );
  
