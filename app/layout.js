import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "EduPlatform - Excel in the New Curriculum with Ease",
  description:
    "Access comprehensive educational resources, earn points through referrals, and join thousands of students succeeding with our platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
