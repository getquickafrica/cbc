'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import {
  BellIcon,
  GiftIcon,
  DocumentArrowDownIcon,
  CreditCardIcon,
  ShareIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const router = useRouter();
  const { user, signInWithGoogle, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Resources', href: '/resources' },
    { name: 'Virtual School', href: '/virtual-school' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const profileMenuItems = [
    { name: 'Withdrawal', icon: CreditCardIcon, href: '/withdrawal' },
    { name: 'Referral', icon: ShareIcon, href: '/referral' },
    { name: 'My Downloads', icon: DocumentArrowDownIcon, href: '/downloads' },
    { name: 'My PDFs', icon: DocumentArrowDownIcon, href: '/my-pdfs' },
  ];

  // Fetch or create profile
useEffect(() => {
  const handleUserPlan = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      // Check if user already has a selected plan
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user plan:', error);
        return;
      }

      if (!data) {
        // User does not have a plan yet — create one placeholder and redirect
        const { error: insertError } = await supabase.from('user_plans').insert([
          {
            user_id: user.id,
            plan: null, // plan will be set after pricing selection
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error('Error creating new user_plan:', insertError);
        } else {
          // redirect to pricing so user can pick a plan
          router.push('/pricing');
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error handling user plan:', err);
    }
  };

  handleUserPlan();
}, [user, router]);


  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EduPlatform</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <img
                    src={user.user_metadata?.avatar_url || '/api/placeholder/32/32'}
                    alt={user.user_metadata?.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-blue-200"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.name || 'User'}
                    </p>
                    {profile?.points && (
                      <p className="text-xs text-blue-600">{profile.points} points</p>
                    )}
                  </div>
                  <BellIcon className="w-5 h-5 text-gray-600" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.user_metadata?.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>

                      <div className="py-2">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <item.icon className="w-4 h-4 mr-3 text-gray-500" />
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignIn}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignIn}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
