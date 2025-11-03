'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MagnifyingGlassIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CloudArrowUpIcon,
  StarIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

const popularPDFs = [
  {
    id: 1,
    title: 'Mathematics Grade 12 - Calculus Essentials',
    thumbnail: 'https://images.pexels.com/photos/6256/mathematics-compass-pencil-geometry.jpg?auto=compress&cs=tinysrgb&w=300',
    downloads: 1547,
    rating: 4.8,
    subject: 'Mathematics',
    grade: 'Grade 12'
  },
  {
    id: 2,
    title: 'Physics Practical Guide - New Curriculum',
    thumbnail: 'https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 1203,
    rating: 4.9,
    subject: 'Physics',
    grade: 'Grade 11-12'
  },
  {
    id: 3,
    title: 'Chemistry Lab Manual 2025',
    thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 987,
    rating: 4.7,
    subject: 'Chemistry',
    grade: 'Grade 10-12'
  },
  {
    id: 4,
    title: 'English Literature Analysis Guide',
    thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 1834,
    rating: 4.9,
    subject: 'English',
    grade: 'Grade 9-12'
  },
  {
    id: 5,
    title: 'Biology Comprehensive Notes',
    thumbnail: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 1456,
    rating: 4.8,
    subject: 'Biology',
    grade: 'Grade 11-12'
  },
  {
    id: 6,
    title: 'History Past Papers Collection',
    thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 743,
    rating: 4.6,
    subject: 'History',
    grade: 'Grade 10-12'
  },
  {
    id: 7,
    title: 'Geography Map Skills Workbook',
    thumbnail: 'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 612,
    rating: 4.7,
    subject: 'Geography',
    grade: 'Grade 9-11'
  },
  {
    id: 8,
    title: 'Computer Science Programming Guide',
    thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300',
    downloads: 1789,
    rating: 4.9,
    subject: 'Computer Science',
    grade: 'Grade 11-12'
  }
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, userProfile } = useAuth();

  const handleDownload = (pdfId) => {
    if (!user) {
      alert('Please sign in to download resources');
      return;
    }
    // Download logic here
    console.log('Downloading PDF:', pdfId);
  };

  const handleShare = (pdfId) => {
    console.log('Sharing PDF:', pdfId);
  };

  const handleView = (pdfId) => {
    console.log('Viewing PDF:', pdfId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Educational Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of high-quality educational materials aligned with the new curriculum
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for title, book title, subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </motion.div>

        {/* Upload and Earn Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
            <div className="flex items-center justify-center mb-4">
              <CloudArrowUpIcon className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Upload and Earn</h2>
            </div>
            <p className="mb-4 text-blue-100">
              Share your study materials and earn points for every download. Help fellow students while building your rewards!
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Upload Resources
            </button>
          </div>
        </motion.div>

        {/* Popular PDFs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Most Popular Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPDFs.map((pdf, index) => (
              <motion.div
                key={pdf.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pdf.thumbnail}
                    alt={pdf.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full text-gray-800">
                      {pdf.subject}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {pdf.grade}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {pdf.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      <span>{pdf.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{pdf.rating}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between space-x-2">
                    <button
                      onClick={() => handleShare(pdf.id)}
                      className="flex items-center justify-center w-full py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Share"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDownload(pdf.id)}
                      className="flex items-center justify-center w-full py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleView(pdf.id)}
                      className="flex items-center justify-center w-full py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 mb-20"
        >
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
            Load More Resources
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourcesPage;