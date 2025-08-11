import HeroSection from "../components/HeroSection";
import Features from "@/components/middlesection1";
import HowItWorks from "@/components/belowsection1";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <HeroSection />
      <Features />
      <HowItWorks />
    </div>
  );
}
