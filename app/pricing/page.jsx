'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckIcon,
  XMarkIcon,
  StarIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Basic',
    originalPrice: { monthly: 10500, yearly: 105000 },
    discountedPrice: { monthly: 9500, yearly: 95000 },
    description: 'Perfect for individual students starting their journey',
    features: [
      { name: 'Access to 1000+ resources', included: true },
      { name: '10 downloads per month', included: true },
      { name: 'Basic search functionality', included: true },
      { name: 'Community forum access', included: true },
      { name: 'Email support', included: true },
      { name: 'Referral earning (limited)', included: false },
      { name: 'Upload resources', included: false },
      { name: 'Priority support', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Virtual school access', included: false }
    ]
  },
  {
    name: 'Standard',
    originalPrice: { monthly: 22000, yearly: 220000 },
    discountedPrice: { monthly: 20000, yearly: 200000 },
    description: 'Most popular choice for serious students',
    popular: true,
    features: [
      { name: 'Access to 5000+ resources', included: true },
      { name: '50 downloads per month', included: true },
      { name: 'Advanced search & filters', included: true },
      { name: 'Community forum access', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Referral earning (standard)', included: true },
      { name: 'Upload up to 10 resources', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Virtual school access', included: false }
    ]
  },
  {
    name: 'Pro',
    originalPrice: { monthly: 50000, yearly: 500000 },
    discountedPrice: { monthly: 45000, yearly: 450000 },
    description: 'Ultimate package for power users and educators',
    features: [
      { name: 'Access to 10000+ resources', included: true },
      { name: 'Unlimited downloads', included: true },
      { name: 'AI-powered search', included: true },
      { name: 'Premium community access', included: true },
      { name: '24/7 priority support', included: true },
      { name: 'Referral earning (unlimited)', included: true },
      { name: 'Upload unlimited resources', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Exclusive content', included: true },
      { name: 'Virtual school access', included: true }
    ]
  }
];

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { user, userProfile } = useAuth();

  const handleSubscribe = (planName) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }
    console.log('Subscribing to:', planName);
    // Payment logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unlock unlimited access to educational resources and start earning through referrals
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isYearly ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                2 months free
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-white rounded-2xl shadow-xl border-2 overflow-hidden ${
                plan.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl text-gray-400 line-through">
                        {isYearly 
                          ? `UGX ${plan.originalPrice.yearly.toLocaleString()} `
                          : `UGX ${plan.originalPrice.monthly.toLocaleString()} `
                        }
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                        10% OFF
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {isYearly 
                        ? ` Shs${plan.discountedPrice.yearly.toLocaleString()} `
                        : `Shs ${plan.discountedPrice.monthly.toLocaleString()} `
                      }
                    </div>
                    <p className="text-gray-500">
                      per {isYearly ? 'year' : 'month'}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      {feature.included ? (
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {user && userProfile?.subscriptionStatus === 'trial' 
                    ? 'Upgrade Now' 
                    : 'Start Free Trial'
                  }
                </button>

                {plan.popular && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Most students choose this plan
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Payment Methods</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <DevicePhoneMobileIcon className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile Money</h4>
              <p className="text-gray-600 text-sm mb-4">
                Pay securely with M-Pesa, Airtel Money, or other mobile money services
              </p>
              <div className="flex items-center justify-center space-x-4">
                <img src="https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=60" alt="M-Pesa" className="h-8 object-contain" />
                <img src="https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=60" alt="Airtel" className="h-8 object-contain" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <CreditCardIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Credit/Debit Card</h4>
              <p className="text-gray-600 text-sm mb-4">
                Secure payment with Visa, Mastercard, or other major cards
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">Money-Back Guarantee</h4>
            <p className="text-blue-800 text-sm">
              Not satisfied? Get a full refund within 30 days, no questions asked. 
              Your success is our priority.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;