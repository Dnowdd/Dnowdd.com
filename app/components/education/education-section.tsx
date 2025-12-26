import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { TextAnimate } from "@/components/ui/text-animate";

const EducationSection = () => {
  const projects = [
    {
      title: "Técnico em Desenvolvimento de Sistemas",
      school: "ETEC de Hortolândia",
      from: "Jan. 2020",
      to: "Dez. 2022",
      description:
        "Curso técnico público voltado para o desenvolvimento de software, programação e análise de sistemas, preparando os alunos para a indústria de TI.",
      tags: ["Cursado", "Ensino Técnico", "Tempo Integral"],
    },
    {
      title: "Gestão da Tecnologia da Informação",
      school: "FATEC Campinas",
      from: "Fev. 2023",
      to: "Dez. 2025",
      description:
        "Curso superior público focado em estratégia de TI, gerenciamento de projetos e soluções empresariais, combinando habilidades técnicas e administrativas.",
      link: "https://netflix.com",
      tags: ["Graduado", "Curso Superior"],
    },
  ];

  return (
    <div className="bg-neutral-950 py-20 relative overflow-hidden">
      <BackgroundRippleEffect cols={35} rows={15} />
      <div className="z-20 relative">
        <TextAnimate
          animation="slideUp"
          by="character"
          className="text-neutral-400 text-2xl font-light leading-2 text-center"
        >
          Minha
        </TextAnimate>
        <TextAnimate
          animation="slideUp"
          by="character"
          className="text-6xl font-bold text-neutral-100 text-center"
        >
          Educação
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center gap-12 max-w-5xl mx-auto px-8">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
};

export default EducationSection;
