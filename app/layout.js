import './globals.css';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@components/Footer';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduPlatform - Excel in the New Curriculum with Ease',
  description: 'Access comprehensive educational resources, earn points through referrals, and join thousands of students succeeding with our platform.',
};


export default function RootLayout({
  children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}