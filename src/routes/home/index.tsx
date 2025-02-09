// Icons
import CardBackground from "@/components/cardBackground";
import CardProject from "@/components/cardProject";

import CardLicenses from "@/components/cardLicenses";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Experience
import ExperienceGenialogic from "@/assets/experience/genialogic.png";

// Education
import EducationEtec from "@/assets/education/Etec.png";
import EducationFatec from "@/assets/education/Fatec.png";

// Projects
import ProjectCreditCardGenerator from "@/assets/projects/CreditCardGenerator.png";
import ProjectQuestVest from "@/assets/projects/QuestVest.png";

// Licenses & certifications
import LicensesAWS from "@/assets/licenses/AWS.png";
import LicensesCisco from "@/assets/licenses/Cisco.png";
import LicensesEF from "@/assets/licenses/EF.png";
import LicensesFreeCodeCamp from "@/assets/licenses/FreeCodeCamp.png";
import LicensesSantanderOpenAcademy from "@/assets/licenses/SantanderOpenAcademy.png";
import CurrentSection from "@/components/currentSection";
/* import { useToast } from "@/components/ui/use-toast"; */

export default function Home() {
  const [projectImage, setProjectImage] = useState<any>(null);
  /* const { toast } = useToast(); */
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

  /* const handleCopyClick = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    toast({
      description: "Link copied to clipboard",
    });
  }; */

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 pb-24 lg:pb-0">
      <div className="fixed bottom-0 left-0 w-full h-[90px] bg-gradient-to-t from-background to-transparent"></div>
      <div className="fixed top-0 left-0 w-full h-[90px] bg-gradient-to-b from-background to-transparent"></div>

      <div className="w-full lg:w-1/2 h-auto lg:h-screen lg:fixed left-0 bottom-0 pt-20 lg:py-10 xl:py-20 lg:pl-20 xl:pl-40 flex flex-col justify-between">
        <div className="gap-2 flex flex-col">
          <h1 className="font-bold text-5xl text-center lg:text-left lg:pr-20">
            Hi, I'm David Queiroz.
          </h1>
          <h2 className="font-semibold text-xl text-neutral-600 text-center lg:text-left">
            Full-stack developer
          </h2>
          <p className="px-6 sm:px-14 lg:px-0 lg:pr-32 text-neutral-500 text-center lg:text-left">
            Full-stack developer focused on innovative solutions, currently an
            IT Management student and software engineering intern, always
            seeking growth in tech.
          </p>
          {/* <div className="flex gap-2 flex-wrap pr-32 mt-8">
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaHtml5 /> HTML
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaCss3Alt /> CSS
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaJs /> Javascript
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaPhp /> PHP
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaPython /> Python
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <DiJqueryLogo /> jQuery
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaReact /> React
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <BiLogoTypescript /> Typescript
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <FaNodeJs /> Node.js
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <SiNextdotjs /> Next.js
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <GrMysql /> MySQL
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <SiMariadb /> MariaDB
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <SiSqlite /> SQLite
            </Badge>
            <Badge variant="outline" className="gap-1 text-neutral-500">
              <SiSupabase /> Supabase
            </Badge>
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <div className="flex gap-2 mr-auto flex items-center">
              <Badge variant="outline" className="gap-1 text-neutral-500">
                <MdEmail /> david.queiroz@dnowdd.com
              </Badge>
              <a href="mailto:david.queiroz@dnowdd.com">
                <FiExternalLink
                  size={12}
                  className="text-neutral-400 transition hover:text-neutral-900"
                />
              </a>
            </div>
            <div className="flex gap-2 mr-auto flex items-center">
              <Badge
                variant="outline"
                className="gap-1 text-neutral-500 mr-auto"
              >
                <TbWorld /> dnowdd.com
              </Badge>
              <span onClick={() => handleCopyClick("https://dnowdd.com")}>
                <FaCopy
                  size={12}
                  className="text-neutral-400 cursor-pointer transition hover:text-neutral-900"
                />
              </span>
            </div>
            <Badge variant="outline" className="gap-1 text-neutral-500 mr-auto">
              <FaMapPin /> Hortolândia, SP - Brazil
            </Badge>
          </div> */}
        </div>
        {!projectImage && (
          <div className="hidden lg:flex flex-col gap-4 pr-32">
            <CurrentSection
              currentSection={currentSection}
              section="aboutMe"
              title="About me"
              sectionRef={sectionRefs.aboutMe}
            />
            <CurrentSection
              currentSection={currentSection}
              section="experience"
              title="Experience"
              sectionRef={sectionRefs.experience}
            />
            <CurrentSection
              currentSection={currentSection}
              section="education"
              title="Education"
              sectionRef={sectionRefs.education}
            />
            <CurrentSection
              currentSection={currentSection}
              section="projects"
              title="Projects"
              sectionRef={sectionRefs.projects}
            />
            <CurrentSection
              currentSection={currentSection}
              section="licenses"
              title="Licenses & certifications"
              sectionRef={sectionRefs.licenses}
            />
          </div>
        )}

        <AnimatePresence>
          {projectImage && (
            <div className="fixed bottom-0 left-0 w-1/2 py-20 px-40">
              <motion.div
                className="aspect-radio w-full rounded-xl overflow-auto shadow-2xl max-h-[330px] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <img src={projectImage} alt="Project Cape" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-1/2 h-full hidden lg:block"></div>
      <div className="w-full lg:w-1/2 h-full lg:py-20 px-6 sm:px-14 lg:px-0 lg:pr-20 xl:pr-40 2xl:pr-80 flex flex-col gap-24">
        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.aboutMe}
          data-section="aboutMe"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400">
              About me
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              I am a Brazilian full-stack developer with hands-on experience
              since 2020, committed to transforming creative ideas into
              impactful technological solutions. Throughout this journey, I have
              developed a passion for exploring how code can be used as a tool
              to solve problems and enhance people's quality of life. My primary
              goal is to create innovative solutions that not only meet users'
              needs but also inspire and empower individuals and organizations
              to achieve their objectives efficiently.
            </p>
            <p>
              I am currently an intern in software engineering at Genialogic
              since February 2024, where I have been deepening my practical
              skills and gaining industry experience. At the same time, I am
              pursuing a degree in Information Technology Management at FATEC
              Campinas, which I began in 2023 and expect to complete by the end
              of 2025. Throughout this journey, I have developed an even greater
              passion for the IT field, driven by the opportunity to create
              innovative and impactful solutions. I am highly engaged in my
              professional development, continuously seeking growth and learning
              to make a meaningful contribution to the field.
            </p>
          </div>
        </div>

        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.experience}
          data-section="experience"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400">
              Experience
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <CardBackground
              image={ExperienceGenialogic}
              role="Intern in software engineering"
              company="Genialogic"
              dateStart={new Date("2024-02-02")}
              description="I develop and maintain CRM and ERP systems using React.js and Node.js, contributing to full-stack development and delivering scalable solutions."
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
            <h1 className="font-semibold text-2xl text-neutral-400">
              Education
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <CardBackground
              image={EducationFatec}
              role="Information Technology Management"
              company="FATEC Campinas"
              dateStart={new Date("2023-01-02")}
              dateEnd={new Date("2025-12-02")}
              description="A comprehensive program focused on IT strategy, project management, and business solutions, combining technical and administrative skills."
              tags={[
                "IT Strategy",
                "Project Management",
                "Business Solutions",
                "System Analysis",
              ]}
            />
            <CardBackground
              image={EducationEtec}
              role="Systems Development Technician"
              company="ETEC de Hortolândia"
              dateStart={new Date("2020-01-02")}
              dateEnd={new Date("2022-12-02")}
              description="A technical course centered on software development, programming, and systems analysis, preparing students for the IT industry."
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
            <h1 className="font-semibold text-2xl text-neutral-400">
              Projects
            </h1>
          </div>
          <div className="flex flex-col md:grid lg:flex xl:grid grid-cols-2 gap-6 md:gap-2 lg:gap-6 xl:gap-2">
            <CardProject
              title="Credit-Card Generator"
              description="This is a simple HTML, CSS and JS project to make a fake credit card, allowing the user to change everything they want."
              tags={["HTML", "CSS", "JavaScript"]}
              onMouseEnter={() => setProjectImage(ProjectCreditCardGenerator)}
              onMouseLeave={() => setProjectImage(null)}
              github="https://github.com/Dnowdd/CreditCard-Image-Generator"
              website="https://dnowdd.github.io/CreditCard-Image-Generator/"
            />
            <CardProject
              title="Quest Vest"
              description="Freelance project for a client who needed a static website to showcase an educational project."
              tags={["React.JS", "TypeScript", "Tailwind"]}
              onMouseEnter={() => setProjectImage(ProjectQuestVest)}
              onMouseLeave={() => setProjectImage(null)}
              github="https://github.com/Dnowdd/QuestVest"
            />
          </div>
        </div>

        <div
          className="flex flex-col gap-4"
          ref={sectionRefs.licenses}
          data-section="licenses"
        >
          <div>
            <h1 className="font-semibold text-2xl text-neutral-400">
              Licenses & certifications
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <CardLicenses
              title="Python"
              company="Santander Open Academy"
              img={LicensesSantanderOpenAcademy}
              issued={new Date("2025-01-02")}
              link="/licenses/SantanderOpenAcademy_001.pdf"
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
