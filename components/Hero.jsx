'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Link from 'next/link';
import { ArrowRightIcon, PlayIcon, GiftIcon  } from '@heroicons/react/24/outline';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute inset-0"/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Excel in the New{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Curriculum
              </span>
              {' '}with Ease
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Access comprehensive educational resources, earn points through referrals, 
              and join thousands of students succeeding with our platform.
            </motion.p>
          </div>

          {/* User Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 border border-gray-200 shadow-lg"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face`}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span className="text-gray-700 font-medium">
              Used by{' '}
              <span className="text-blue-600 font-bold">
                <CountUp end={20000} duration={2} separator="," />+
              </span>
              {' '}students
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link
              href="/auth"
              className="group inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="font-semibold">Start Free Trial</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <button className="group inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-lg hover:shadow-xl">
              <PlayIcon className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Watch Demo</span>
            </button>
          </motion.div>

          {/* Trial Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="inline-flex items-center space-x-2 text-sm text-gray-600"
          >
            <GiftIcon className="w-4 h-4 text-green-500" />
            <span>7-day free trial • No credit card required • Cancel anytime</span>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Students learning"
              className="rounded-2xl shadow-2xl border border-gray-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;