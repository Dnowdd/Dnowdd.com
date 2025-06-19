// Icons
import CardBackground from "@/components/cardBackground";

import CardLicenses from "@/components/cardLicenses";
import { useEffect, useRef, useState } from "react";

// Experience
import ExperienceGenialogic from "@/assets/experience/genialogic.png";

// Education
import EducationEtec from "@/assets/education/Etec.png";
import EducationFatec from "@/assets/education/Fatec.png";

// Licenses & certifications
import LicensesAWS from "@/assets/licenses/AWS.png";
import LicensesCanva from "@/assets/licenses/Canva.png";
import LicensesCisco from "@/assets/licenses/Cisco.png";
import LicensesEF from "@/assets/licenses/EF.png";
import LicensesETS from "@/assets/licenses/ETS.png";
import LicensesFreeCodeCamp from "@/assets/licenses/FreeCodeCamp.png";
import LicensesSantanderOpenAcademy from "@/assets/licenses/SantanderOpenAcademy.png";
import CurrentSection from "@/components/currentSection";
import ProjectsContainer from "@/components/projectsContainer";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const [currentSection, setCurrentSection] = useState("");

  const sectionRefs = {
    aboutMe: useRef(null),
    experience: useRef(null),
    education: useRef(null),
    projects: useRef(null),
    licenses: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = currentSection; // Seção atual como fallback
        let maxRatio = 0; // Proporção máxima visível

        entries.forEach((entry) => {
          const section = entry.target.getAttribute("data-section");
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleSection = section || visibleSection;
          }
        });

        if (visibleSection !== currentSection) {
          setCurrentSection(visibleSection); // Atualiza somente se mudar
        }
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // Cria valores de 0.0 a 1.0
        rootMargin: "0px 0px -50% 0px", // Dá prioridade à seção mais central
      }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [currentSection]); // Adicione a dependência para evitar loops infinitos

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 pb-24 lg:pb-0">
      <div className="fixed bottom-0 left-0 w-full h-[90px] bg-gradient-to-t from-background to-transparent"></div>
      <div className="fixed top-0 left-0 w-full h-[90px] bg-gradient-to-b from-background to-transparent"></div>

      <div className="w-full lg:w-1/2 h-auto lg:h-screen lg:fixed left-0 bottom-0 pt-20 lg:py-10 xl:py-20 lg:pl-20 xl:pl-40 flex flex-col justify-between">
        <div className="gap-2 flex flex-col">
          <h1 className="font-bold text-5xl text-center lg:text-left lg:pr-20">
            {t("title")}
          </h1>
          <h2 className="font-semibold text-xl text-neutral-600 dark:text-neutral-300 text-center lg:text-left">
            {t("role")}
          </h2>
          <p className="px-6 sm:px-14 lg:px-0 lg:pr-32 text-neutral-500 dark:text-neutral-400 text-center lg:text-left">
            {t("description")}
          </p>
        </div>
        <div className="hidden lg:flex flex-col gap-4 pr-32">
          <CurrentSection
            currentSection={currentSection}
            section="aboutMe"
            title={t("aboutme_title")}
            sectionRef={sectionRefs.aboutMe}
          />
          <CurrentSection
            currentSection={currentSection}
            section="experience"
            title={t("experience_title")}
            sectionRef={sectionRefs.experience}
          />
          <CurrentSection
            currentSection={currentSection}
            section="education"
            title={t("education_title")}
            sectionRef={sectionRefs.education}
          />
          <CurrentSection
            currentSection={currentSection}
            section="projects"
            title={t("projects_title")}
            sectionRef={sectionRefs.projects}
          />
          <CurrentSection
            currentSection={currentSection}
            section="licenses"
            title={t("licenses_title")}
            sectionRef={sectionRefs.licenses}
          />
        </div>
      </div>
      <div className="w-1/2 h-full hidden lg:block"></div>
      <div className="w-full lg:w-1/2 h-full lg:py-20 px-6 sm:px-14 lg:px-0 lg:pr-20 xl:pr-40 2xl:pr-80 flex flex-col gap-24">
        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.aboutMe}
          data-section="aboutMe"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-200">
              {t("aboutme_title")}
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <p>{t("aboutme_content_1")}</p>
            <p>{t("aboutme_content_2")}</p>
          </div>
        </div>

        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.experience}
          data-section="experience"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-200">
              {t("experience_title")}
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <CardBackground
              image={ExperienceGenialogic}
              role={t("experience_genialogic_role")}
              company="Genialogic"
              dateStart={new Date("2024-02-02")}
              description={t("experience_genialogic_description")}
              tags={[
                "React.js",
                "Node.js",
                "TypeScript",
                "Full-stack Development",
                "API Integration",
              ]}
            />
          </div>
        </div>

        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.education}
          data-section="education"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-200">
              {t("education_title")}
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <CardBackground
              image={EducationFatec}
              role={t("education_fatec_role")}
              company="FATEC Campinas"
              dateStart={new Date("2023-01-02")}
              dateEnd={new Date("2025-12-02")}
              description={t("education_fatec_description")}
              tags={[
                "IT Strategy",
                "Project Management",
                "Business Solutions",
                "System Analysis",
              ]}
            />
            <CardBackground
              image={EducationEtec}
              role={t("education_etec_role")}
              company="ETEC de Hortolândia"
              dateStart={new Date("2020-01-02")}
              dateEnd={new Date("2022-12-02")}
              description={t("education_etec_description")}
              tags={[
                "Software Development",
                "Technical Documentation",
                "Database Management",
              ]}
            />
          </div>
        </div>

        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.projects}
          data-section="projects"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-200">
              {t("projects_title")}
            </h1>
          </div>
          <ProjectsContainer />
        </div>

        {/* <div
          className="flex flex-col gap-4"
          ref={sectionRefs.projects}
          data-section="projects"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-200">
              {t("projects_title")}
            </h1>
          </div>
          <div className="flex flex-col md:grid lg:flex xl:grid grid-cols-2 gap-6 md:gap-2 lg:gap-6 xl:gap-2">
            <CardProject
              title={t("projects_hidrata_title")}
              description={t("projects_hidrata_description")}
              tags={["Flutter", "Dart", "Android", "IOS"]}
              projectImage={ProjectHidrata}
              mobile
              github="https://github.com/Dnowdd/Hidrata"
            />
            <CardProject
              title={t("projects_deepchat_title")}
              description={t("projects_deepchat_description")}
              tags={["React.JS", "JavaScript", "DeepSeek"]}
              projectImage={ProjectDeepChat}
              github="https://github.com/Dnowdd/DeepChat"
            />
            <CardProject
              title={t("projects_questvest_title")}
              description={t("projects_questvest_description")}
              tags={["React.JS", "TypeScript", "Tailwind"]}
              projectImage={ProjectQuestVest}
              github="https://github.com/Dnowdd/QuestVest"
            />
            <CardProject
              title={t("projects_creditcard_title")}
              description={t("projects_creditcard_description")}
              tags={["HTML", "CSS", "JavaScript"]}
              projectImage={ProjectCreditCardGenerator}
              github="https://github.com/Dnowdd/CreditCard-Image-Generator"
              website="https://dnowdd.github.io/CreditCard-Image-Generator/"
            />
          </div>
        </div> */}

        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.licenses}
          data-section="licenses"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-200">
              {t("licenses_title")}
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <CardLicenses
              title="The field guide to Human-Centered Design"
              company="Canva"
              img={LicensesCanva}
              issued={new Date("2025-04-02")}
              link="https://www.canva.com/design-school/certification-award/f9302937-29c9-4f74-a6db-60092bffd61e"
            />
            <CardLicenses
              title="Python"
              company="Santander Open Academy"
              img={LicensesSantanderOpenAcademy}
              issued={new Date("2025-01-02")}
              link="/licenses/SantanderOpenAcademy_001.pdf"
            />
            <CardLicenses
              title="ETS Toeic | 720"
              company="ETS + MasterTest Global"
              img={LicensesETS}
              issued={new Date("2024-10-17")}
              link="/licenses/ETSToeic_001.pdf"
            />
            <CardLicenses
              title="Intercultural discussions: Brazil and China"
              company="FATEC Campinas"
              img={EducationFatec}
              issued={new Date("2024-06-02")}
              link="/licenses/Fatec_001.pdf"
            />
            <CardLicenses
              title="AWS Academy Graduate - Cloud Foundations"
              company="Amazon Web Services (AWS)"
              img={LicensesAWS}
              issued={new Date("2023-11-02")}
              link="https://www.credly.com/badges/af23eec7-af0e-413b-829d-9c9a999325e2"
            />
            <CardLicenses
              title="Computer Hardware Basics"
              company="Cisco"
              img={LicensesCisco}
              issued={new Date("2023-11-02")}
              link="https://www.credly.com/badges/bb49e1a6-6086-4c9c-b7b2-b645944c0caa"
            />
            <CardLicenses
              title="English Upper Advanced"
              company="EF English Live"
              img={LicensesEF}
              issued={new Date("2022-07-02")}
              link="/licenses/EFEnglishLive_001.pdf"
            />
            <CardLicenses
              title="Responsive Web Design"
              company="freeCodeCamp"
              img={LicensesFreeCodeCamp}
              issued={new Date("2022-02-02")}
              link="https://freecodecamp.org/certification/Dnowd/responsive-web-design"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
