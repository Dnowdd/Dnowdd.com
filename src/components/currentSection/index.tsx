import { motion } from "framer-motion";

interface CurrentSectionProps {
  currentSection: string;
  section: string;
  title: string;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function CurrentSection({
  currentSection,
  section,
  title,
  sectionRef,
}: CurrentSectionProps) {
  const handleScroll = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth", // Animação suave ao rolar
        block: "center", // Alinha a seção no centro da viewport
      });
    }
  };

  return (
    <div
      className="flex gap-4 items-center cursor-pointer"
      onClick={handleScroll}
    >
      <motion.div
        className="h-0.5 bg-neutral-500 rounded"
        initial={{ width: "0.125rem" }} // Largura inicial
        animate={{
          width: currentSection === section ? "1.25rem" : "0.125rem", // Largura dinâmica
        }}
        transition={{
          duration: 0.3, // Duração da animação
          ease: "easeInOut", // Tipo de curva de animação
        }}
      />
      <h1
        className={`text-xl ${
          currentSection === section
            ? "text-neutral-700"
            : "text-neutral-500 hover:text-neutral-600"
        }`}
      >
        {title}
      </h1>
    </div>
  );
}
