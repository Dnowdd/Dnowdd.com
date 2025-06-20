import { t } from "i18next";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub } from "react-icons/fa6";

// Projects
import ProjectCreditCardGenerator from "@/assets/projects/CreditCardGenerator.png";
import ProjectQuestVest from "@/assets/projects/QuestVest.png";
import ProjectHidrata from "@/assets/projects/Hidrata.png";
import ProjectDeepChat from "@/assets/projects/DeepChat.png";
import { TbWorld } from "react-icons/tb";
import { Pause, Play } from "lucide-react";

const ProjectsContainer = () => {
  const projects = [
    {
      title: t("projects_hidrata_title"),
      description: t("projects_hidrata_description"),
      tags: ["Flutter", "Dart", "Android", "IOS"],
      image: ProjectHidrata,
      links: [
        {
          icon: <FaGithub />,
          label: "GitHub",
          url: "https://github.com/Dnowdd/Hidrata",
        },
      ],
    },
    {
      title: t("projects_deepchat_title"),
      description: t("projects_deepchat_description"),
      tags: ["React.JS", "JavaScript", "DeepSeek"],
      image: ProjectDeepChat,
      links: [
        {
          icon: <FaGithub />,
          label: "GitHub",
          url: "https://github.com/Dnowdd/DeepChat",
        },
      ],
    },
    {
      title: t("projects_questvest_title"),
      description: t("projects_questvest_description"),
      tags: ["React.JS", "TypeScript", "Tailwind"],
      image: ProjectQuestVest,
      links: [
        {
          icon: <FaGithub />,
          label: "GitHub",
          url: "https://github.com/Dnowdd/QuestVest",
        },
      ],
    },
    {
      title: t("projects_creditcard_title"),
      description: t("projects_creditcard_description"),
      tags: ["HTML", "CSS", "JavaScript"],
      image: ProjectCreditCardGenerator,
      links: [
        {
          icon: <FaGithub />,
          label: "GitHub",
          url: "https://github.com/Dnowdd/CreditCard-Image-Generator",
        },
        {
          icon: <TbWorld />,
          label: "Website",
          url: "https://dnowdd.github.io/CreditCard-Image-Generator/",
        },
      ],
    },
  ];

  const [selectedProject, setSelectedProject] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0); // Para armazenar o tempo quando pausou

  // Auto incrementa o projeto selecionado a cada 10 segundos
  useEffect(() => {
    if (isPaused) return; // Se estiver pausado, não faz nada

    let startTime = Date.now() - pausedTime; // Considera o tempo já decorrido antes da pausa
    const duration = 10000; // 10 segundos

    // Reseta o progresso apenas quando o projeto muda (não quando pausa/despausa)
    if (pausedTime === 0) {
      setProgress(0);
      startTime = Date.now();
    }

    // Atualiza o progresso a cada 100ms
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressPercent);
    }, 100);

    // Muda o projeto a cada 10 segundos
    const projectInterval = setInterval(() => {
      setSelectedProject((prevSelected) => {
        // Se chegou no último projeto, volta para o primeiro (índice 0)
        const nextIndex = prevSelected + 1;
        return nextIndex >= projects.length ? 0 : nextIndex;
      });
      setPausedTime(0); // Reset do tempo pausado quando muda projeto automaticamente
    }, duration - pausedTime); // Ajusta o tempo baseado no que já passou

    // Cleanup dos intervals quando o componente for desmontado
    return () => {
      clearInterval(progressInterval);
      clearInterval(projectInterval);
    };
  }, [projects.length, selectedProject, isPaused, pausedTime]);

  // Captura o tempo decorrido quando pausa
  useEffect(() => {
    if (isPaused) {
      const elapsed = (progress / 100) * 10000; // Converte progresso de volta para ms
      setPausedTime(elapsed);
    } else {
      // Se despausar, não resetar o pausedTime imediatamente
    }
  }, [isPaused, progress]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border p-4 flex flex-col gap-4 w-full">
        <div
          className="aspect-video w-full bg-cover bg-top bg-no-repeat z-10"
          style={{
            backgroundImage: `url(${projects[selectedProject].image})`,
          }}
        ></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProject}
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h1 className="font-semibold text-xl">
              {projects[selectedProject].title}
            </h1>
            <p className="text-sm line-clamp-2 text-neutral-500 dark:text-neutral-400">
              {projects[selectedProject].description}
            </p>
            <div className="flex gap-1">
              {projects[selectedProject].tags.map((tag, index) => (
                <Badge
                  variant="outline"
                  className="text-neutral-500 dark:text-neutral-400"
                  key={`badge-${index}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2">
          {projects[selectedProject].links.map((link, index) => (
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              key={`link-${index}`}
            >
              <Button size="sm">
                {link.icon}
                {link.label}
              </Button>
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-between items-end">
          <p className="font-semibold">Selecionar projeto:</p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-neutral-500 hover:text-neutral-700"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </Button>
        </div>
        <div className="grid grid-cols-2 w-full gap-2">
          {projects.map((project, index) => (
            <motion.div
              className={`select-none rounded-xl border p-4 flex flex-col w-full cursor-pointer dark:hover:bg-neutral-800 transition-colors relative overflow-hidden ${
                index === selectedProject
                  ? "border-primary"
                  : "hover:bg-neutral-100"
              }`}
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setSelectedProject(index);
                setPausedTime(0); // Reset quando muda projeto manualmente
              }}
            >
              <h1 className="font-semibold text-md">{project.title}</h1>
              <p className="text-xs line-clamp-2 text-neutral-500 dark:text-neutral-400">
                {project.description}
              </p>
              <motion.div
                className="absolute inset-0 h-full z-[-1] bg-blue-200/50"
                initial={{ width: "0%" }}
                animate={{
                  width: index === selectedProject ? `${progress}%` : "0%",
                }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsContainer;
