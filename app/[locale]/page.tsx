import { setRequestLocale } from "next-intl/server";
import AboutSection from "@/app/components/about/about-section";
import { PersonalShelf } from "@/app/components/about/personal-shelf";
import ContactSection from "@/app/components/contact/contact-section";
import HeroSection from "@/app/components/hero/hero-section";
import JourneySection from "@/app/components/journey/journey-section";
import ProjectSection from "@/app/components/projects/projects-section";
import { SectionNav } from "@/app/components/section-nav";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Parameters<typeof setRequestLocale>[0]);

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
