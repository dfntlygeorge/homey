import { HeroSection } from "@/components/homepage/hero-section";
import { HowItWorksSection } from "@/components/homepage/how-it-works-section";
import { SocialProofSection } from "@/components/homepage/social-proof-section";
import { TestimonialSection } from "@/components/homepage/testimonial-section";

export default async function Home() {
  return (
    <div className="bg-background min-h-screen w-full">
      <HeroSection />
      <HowItWorksSection />
      <SocialProofSection />
      <TestimonialSection />
    </div>
  );
}
