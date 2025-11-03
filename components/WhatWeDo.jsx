'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  CloudArrowUpIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: BookOpenIcon,
    title: 'Comprehensive Resources',
    description: 'Access thousands of educational PDFs, textbooks, and study materials aligned with the new curriculum.'
  },
  {
    icon: CloudArrowUpIcon,
    title: 'Upload & Share',
    description: 'Upload your own resources and earn points while helping other students succeed in their studies.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Virtual Learning',
    description: 'Join our virtual school environment with interactive lessons and real-time collaboration tools.'
  },
  {
    icon: ChartBarIcon,
    title: 'Progress Tracking',
    description: 'Monitor your learning progress with detailed analytics and personalized recommendations.'
  },
  {
    icon: UserGroupIcon,
    title: 'Community Support',
    description: 'Connect with fellow students, share knowledge, and get help from our active community.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Quality Assured',
    description: 'All resources are verified by education experts to ensure accuracy and curriculum alignment.'
  }
];

const WhatWeDo = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive educational solutions to help students excel 
            in the new curriculum with confidence and ease.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;