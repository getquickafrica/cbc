'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { saveUserPlan } from '@/utilis/saveUserPlan';

import { CheckIcon, StarIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for beginners exploring the platform.',
    price: { weekly: 0, monthly: 0, yearly: 0 },
    features: [
      'Access to 100+ resources',
      '2 downloads per week',
      'Basic search',
      'Community forum access'
    ],
    buttonText: 'Start for Free',
    buttonStyle: 'bg-green-500 hover:bg-green-600 text-white',
  },
  {
    name: 'Basic',
    description: 'For individual learners starting their journey.',
    price: { weekly: 1500, monthly: 9500, yearly: 95000 },
    features: [
      'Access to 1000+ resources',
      '10 downloads per month',
      'Email support',
      'Community access'
    ],
    buttonText: 'Upgrade Now',
    buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  {
    name: 'Standard',
    description: 'Most popular for active students and creators.',
    price: { weekly: 3000, monthly: 20000, yearly: 200000 },
    features: [
      'Access to 5000+ resources',
      'Priority support',
      'Referral earnings',
      'Upload up to 10 resources'
    ],
    popular: true,
    buttonText: 'Upgrade Now',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    name: 'Pro',
    description: 'For educators and advanced users.',
    price: { weekly: 6500, monthly: 45000, yearly: 450000 },
    features: [
      'Unlimited resources',
      'AI-powered search',
      'Advanced analytics',
      '24/7 support'
    ],
    buttonText: 'Upgrade Now',
    buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
];

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user } = useAuth();
  const router = useRouter()
  


  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Predictable pricing, designed to grow with you
        </h1>
        <p className="text-gray-600 text-lg">
          Start free, then upgrade when you're ready.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mt-8 space-x-4">
          {['weekly', 'monthly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === cycle
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative rounded-2xl border bg-white shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
              plan.popular ? 'border-blue-600 shadow-lg scale-105' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                <StarIcon className="w-4 h-4 mr-1" />
                Most Popular
              </span>
            )}

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {plan.price[billingCycle] === 0
                  ? 'UGX 0'
                  : `UGX ${plan.price[billingCycle].toLocaleString()}`}
              </div>
              <p className="text-gray-500 text-sm mb-6">
                per {billingCycle.replace('ly', '')}
              </p>

              <ul className="text-left space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

                <button
                  onClick={async () => {
                    if (!user) {
                      alert('Please sign in to continue');
                      router.push('/auth');
                      return;
                    }
                    try {
                      const { data, error } = await saveUserPlan(user.id, plan.name);
                      if (error) {
                        console.error('Error saving plan:', error);
                        alert('Something went wrong while saving your plan.');
                        return;
                      }
                      alert(`✅ Successfully subscribed to the ${plan.name} plan!`);
                      router.push('/'); // or /dashboard
                    } catch (err) {
                      console.error(err);
                      alert('Unexpected error occurred.');
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-semibold ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>


          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
