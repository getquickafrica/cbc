'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Grade 12 Student',
    image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'This platform transformed my study routine. The resources are comprehensive and the earning system motivated me to share my notes with classmates.',
    rating: 5,
    subject: 'Mathematics & Physics'
  },
  {
    name: 'Michael Chen',
    role: 'University Student',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Amazing resource library! I\'ve earned over 2000 points through referrals and now have access to premium content. Highly recommended!',
    rating: 5,
    subject: 'Computer Science'
  },
  {
    name: 'Emma Williams',
    role: 'Grade 11 Student',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The new curriculum was challenging, but this platform made everything so much easier. The quality of materials is outstanding.',
    rating: 5,
    subject: 'Biology & Chemistry'
  },
  {
    name: 'David Ochieng',
    role: 'Form 4 Student',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'I love how I can earn points by uploading my past papers. It\'s a win-win situation - helping others while building my own resource library.',
    rating: 5,
    subject: 'History & Geography'
  },
  {
    name: 'Grace Kimani',
    role: 'Grade 10 Student',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The search feature is incredible! I can find exactly what I need for any subject. The download system is smooth and reliable.',
    rating: 5,
    subject: 'Languages & Literature'
  },
  {
    name: 'James Mwangi',
    role: 'University Graduate',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Used this throughout my final year. The referral system helped me earn enough points to access premium resources for free.',
    rating: 5,
    subject: 'Engineering'
  }
];

const Testimonials = () => {
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
            What Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful students who have transformed their learning experience with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-blue-600 font-medium">{testimonial.subject}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Them?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your free trial today and discover why thousands of students trust our platform for their educational success.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;