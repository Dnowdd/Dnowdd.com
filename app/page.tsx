import AboutSection from "./components/about/about-section";
import CompaniesSection from "./components/companies/companies-section";
import EducationSection from "./components/education/education-section";
import { FooterSection } from "./components/footer/footer-section";
import HeroSection from "./components/hero/hero-section";
import ProjectSection from "./components/projects/projects-section";
import { SectionNav } from "./components/section-nav";
import SocialmediasSection from "./components/socialmedias/socialmedias-section";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full max-w-[100vw]">
      <SectionNav />

      <HeroSection />

      <AboutSection />

      <ProjectSection />

      <SocialmediasSection />

      <CompaniesSection />

      <EducationSection />

      <FooterSection />
    </main>
  );
}
