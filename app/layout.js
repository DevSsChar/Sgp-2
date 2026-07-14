import AccessibilityChatbot from "@/components/AccessibilityChatbot";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ScanDataProvider } from "@/components/ScanDataContext";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/ThemeContext";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import "./dark-mode.css";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
});

export const metadata = {
  title: "AccessibilityGuard - Make Your Website Accessible with AI",
  description: "Automated WCAG 2.1 compliance scanning, AI-powered fixes, and multilingual accessibility reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable} font-body antialiased`}
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
