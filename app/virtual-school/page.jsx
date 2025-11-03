'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  ClockIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const VirtualSchoolPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
          >
            <AcademicCapIcon className="w-12 h-12 text-white" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Virtual School
            </h1>
            
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <ClockIcon className="w-5 h-5" />
              <span className="text-lg font-semibold">Coming Soon</span>
            </div>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're building an innovative virtual learning environment that will revolutionize 
              how students interact with the new curriculum. Stay tuned for an amazing experience!
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                icon: SparklesIcon,
                title: 'Interactive Lessons',
                description: 'Engaging multimedia content with real-time interaction'
              },
              {
                icon: AcademicCapIcon,
                title: 'Live Classes',
                description: 'Join live sessions with expert teachers and fellow students'
              },
              {
                icon: ClockIcon,
                title: 'Flexible Schedule',
                description: 'Learn at your own pace with 24/7 access to content'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Notification Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Be the First to Know
            </h3>
            <p className="text-gray-600 mb-6">
              Get notified when Virtual School launches. Early access subscribers get exclusive benefits!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold whitespace-nowrap">
                Notify Me
              </button>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center justify-center space-x-2">
                <SparklesIcon className="w-4 h-4" />
                <span>Early subscribers get 1000 bonus points + exclusive content</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VirtualSchoolPage;