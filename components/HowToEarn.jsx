'use client';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShareIcon, 
  CloudArrowUpIcon, 
  CurrencyDollarIcon,
  UserPlusIcon,
  ArrowRightIcon

} from '@heroicons/react/24/outline';


const earningMethods = [
  {
    icon: UserPlusIcon,
    title: 'Refer Friends',
    description: 'Invite friends to join our platform and earn 500 coins for each successful referral.',
    points: '500 points',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: CloudArrowUpIcon,
    title: 'Upload Resources',
    description: 'Share your study materials, past papers, and notes. Earn points based on downloads.',
    points: '50-200 points',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ShareIcon,
    title: 'Share Content',
    description: 'Share our resources on social media and earn bonus points for engagement.',
    points: '25-100 points',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Premium Subscription',
    description: 'Subscribe to unlock unlimited downloads and exclusive referral earning opportunities.',
    points: 'Unlimited',
    color: 'from-orange-500 to-red-500'
  }
];

const HowToEarn = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to Earn Points
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build your points balance through referrals, content uploads, and active participation. 
            Redeem points for premium features and rewards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {earningMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {method.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                    {method.points}
                  </span>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Earning Today!
            </h3>
            <p className="text-gray-600 mb-6">
              Join our platform and start earning points immediately. Get 100 welcome points just for signing up!
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span className="font-semibold">Get Started</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowToEarn;