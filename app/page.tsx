import AboutSection from "./components/about/about-section";
import { PersonalShelf } from "./components/about/personal-shelf";
import ContactSection from "./components/contact/contact-section";
import HeroSection from "./components/hero/hero-section";
import JourneySection from "./components/journey/journey-section";
import ProjectSection from "./components/projects/projects-section";
import { SectionNav } from "./components/section-nav";

export default function Home() {
  return (
    <main className="overflow-x-clip w-full max-w-[100vw]">
      <SectionNav />

      <HeroSection />

      <AboutSection>
        <PersonalShelf />
      </AboutSection>

      <ProjectSection />

      <JourneySection />

      <ContactSection />
    </main>
  );
}
