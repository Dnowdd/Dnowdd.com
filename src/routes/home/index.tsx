import EtecImage from "@/assets/education/etec.jpg";
import FatecImage from "@/assets/education/fatec.jpg";
import GenialogicImage from "@/assets/works/genialogic.png";
import CardExperience from "@/components/cardExperience";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import NumberTicker from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { BiLogoTypescript } from "react-icons/bi";
import { DiJqueryLogo } from "react-icons/di";
import {
  FaCss3Alt,
  FaHtml5,
  FaJs,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaReact,
} from "react-icons/fa6";
import { GrMysql } from "react-icons/gr";
import { SiMariadb, SiNextdotjs, SiSqlite } from "react-icons/si";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div className="flex flex-col items-start gap-4">
          <div className="relative">
            <GradualSpacing
              className="font-display text-center text-2xl min-[360px]:text-4xl min-[470px]:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-[-0.21em] min-[360px]:tracking-[-0.19em] min-[470px]:tracking-[-0.16em] sm:tracking-[-0.14em] md:tracking-[-0.10em]" /* text-6xl tracking-[-0.10em] */
              text="Hi, I'm David Aquino."
            />
            <p className="absolute top-0 right-0 translate-x-[135%] text-xs min-[360px]:text-base min-[490px]:text-lg sm:text-xl whitespace-pre-wrap font-medium text-black dark:text-white">
              <NumberTicker value={19} delay={1.2} />
            </p>
          </div>

          <p className="text-base sm:text-lg md:text-xl !leading-5 sm:!leading-6">
            Full-stack developer with a passion for web development and a knack
            for tackling new challenges. Always exploring the cutting edge of
            technology. 🚀
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-xl">About</h2>
        <p className="text-base sm:text-lg md:text-xl !leading-5 sm:!leading-6">
          I am a Brazilian full-stack programmer and have dedicated the last
          four years to honing my skills in this ever-evolving field. My journey
          has been fueled by a relentless pursuit of knowledge and a passion for
          technology. I am currently immersed in my role at Genialogic, where I
          contribute as a Software Engineer.
        </p>
      </div>

      <div>
        <h2 className="font-bold text-xl">Work Experience</h2>

        <div>
          <CardExperience
            image={GenialogicImage}
            title="Genialogic"
            subtitle="Intern - Software Engineer"
            dateStart={new Date(2024, 1)}
            active
          />
        </div>
      </div>

      <div>
        <h2 className="font-bold text-xl">Education</h2>

        <div className="flex flex-col gap-4">
          <CardExperience
            image={FatecImage}
            title="FATEC Campinas"
            subtitle="Information Technology Management"
            dateStart={new Date(2023, 0)}
            dateEnd={new Date(2025, 11)}
            active
          />
          <CardExperience
            image={EtecImage}
            title="ETEC de Hortolândia"
            subtitle="Systems Development"
            dateStart={new Date(2020, 0)}
            dateEnd={new Date(2022, 11)}
          />
        </div>
      </div>

      <div>
        <h2 className="font-bold text-xl">Skills</h2>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1">
            <FaHtml5 /> HTML
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FaCss3Alt /> CSS
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FaJs /> Javascript
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FaPhp /> PHP
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FaPython /> Python
          </Badge>
          <Badge variant="outline" className="gap-1">
            <DiJqueryLogo /> jQuery
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FaReact /> React
          </Badge>
          <Badge variant="outline" className="gap-1">
            <BiLogoTypescript /> Typescript
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FaNodeJs /> Node.js
          </Badge>
          <Badge variant="outline" className="gap-1">
            <SiNextdotjs /> Next.js
          </Badge>
          <Badge variant="outline" className="gap-1">
            <GrMysql /> MySQL
          </Badge>
          <Badge variant="outline" className="gap-1">
            <SiMariadb /> MariaDB
          </Badge>
          <Badge variant="outline" className="gap-1">
            <SiSqlite /> SQLite
          </Badge>
        </div>
      </div>
    </div>
  );
}
