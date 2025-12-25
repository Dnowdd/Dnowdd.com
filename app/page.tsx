import CompaniesSection from "./components/companies/companies";
import HeroSection from "./components/hero/hero-section";
import ProjectSection from "./components/projects/projects-section";
import SocialmediasSection from "./components/socialmedias/socialmedias-section";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <ProjectSection />

      <SocialmediasSection />

      <CompaniesSection />
    </main>
  );
}
