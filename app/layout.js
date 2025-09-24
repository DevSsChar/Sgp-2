import AccessibilityChatbot from "@/components/AccessibilityChatbot";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ScanDataProvider } from "@/components/ScanDataContext";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/ThemeContext";
import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import "./dark-mode.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AccessibilityGuard - Make Your Website Accessible with AI",
  description: "Automated WCAG 2.1 compliance scanning, AI-powered fixes, and multilingual accessibility reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${roboto.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionWrapper>
          <ThemeProvider>
            <ScanDataProvider>
              <Navbar />
              {children}
              <Footer />
              <AccessibilityChatbot />
            </ScanDataProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
