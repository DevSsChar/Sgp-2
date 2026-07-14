import HeroSection from "../components/HeroSection";
import Features from "@/components/middlesection1";
import HowItWorks from "@/components/belowsection1";
import FinalCTA from "@/components/FinalCTA";
import LandingCyberBackground from "@/components/LandingCyberBackground";

export default function Home() {
  return (
    <div className="landing-page relative overflow-x-hidden selection:bg-cx-primary selection:text-cx-bg font-mono-cx text-cx-on-surface antialiased cursor-crosshair">
      <LandingCyberBackground />
      <main className="relative z-10 pb-12">
        <HeroSection />
        <Features />
        <HowItWorks />
        <FinalCTA />
      </main>
    </div>
  );
}
