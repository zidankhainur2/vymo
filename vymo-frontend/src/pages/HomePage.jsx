// src/pages/HomePage.jsx
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import HowToUseSection from "../components/HowToUseSection";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 min-h-screen text-purple-100 overflow-x-hidden">
      <HeroSection />
      <HowToUseSection />
      <FeaturesSection />
    </div>
  );
}
