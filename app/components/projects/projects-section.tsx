"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/utils";
import { Github, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
  useTransform,
} from "framer-motion";

const ProjectSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartX = useRef(0);

  const x = useMotionValue(0);

  const projects = [
    {
      title: "Projeto 1",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos temporibus magni laudantium officiis illo nesciunt ipsa, distinctio dolor, deserunt culpa esse, fuga reprehenderit architecto! Sit placeat eligendi autem odit ut!",
      image: "https://placehold.co/1920x1080?text=Projeto+1",
      links: [
        { icon: Github, url: "#" },
        { icon: Globe, url: "#" },
      ],
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
    },
    {
      title: "Projeto 2",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos temporibus magni laudantium officiis illo nesciunt ipsa, distinctio dolor, deserunt culpa esse, fuga reprehenderit architecto! Sit placeat eligendi autem odit ut!",
      image: "https://placehold.co/1920x1080?text=Projeto+2",
      links: [
        { icon: Github, url: "#" },
        { icon: Globe, url: "#" },
      ],
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
    },
    {
      title: "Projeto 3",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos temporibus magni laudantium officiis illo nesciunt ipsa, distinctio dolor, deserunt culpa esse, fuga reprehenderit architecto! Sit placeat eligendi autem odit ut!",
      image: "https://placehold.co/1920x1080?text=Projeto+3",
      links: [
        { icon: Github, url: "#" },
        { icon: Globe, url: "#" },
      ],
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
    },
    {
      title: "Projeto 4",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos temporibus magni laudantium officiis illo nesciunt ipsa, distinctio dolor, deserunt culpa esse, fuga reprehenderit architecto! Sit placeat eligendi autem odit ut!",
      image: "https://placehold.co/1920x1080?text=Projeto+4",
      links: [
        { icon: Github, url: "#" },
        { icon: Globe, url: "#" },
      ],
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
    },
    {
      title: "Projeto 5",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos temporibus magni laudantium officiis illo nesciunt ipsa, distinctio dolor, deserunt culpa esse, fuga reprehenderit architecto! Sit placeat eligendi autem odit ut!",
      image: "https://placehold.co/1920x1080?text=Projeto+5",
      links: [
        { icon: Github, url: "#" },
        { icon: Globe, url: "#" },
      ],
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
    },
    {
      title: "Projeto 6",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos temporibus magni laudantium officiis illo nesciunt ipsa, distinctio dolor, deserunt culpa esse, fuga reprehenderit architecto! Sit placeat eligendi autem odit ut!",
      image: "https://placehold.co/1920x1080?text=Projeto+6",
      links: [
        { icon: Github, url: "#" },
        { icon: Globe, url: "#" },
      ],
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
    },
  ];

  const currentProject = projects[currentSlide];

  // Calcular largura do container e maxScroll
  useEffect(() => {
    const updateDimensions = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Calcular maskImage dinamicamente baseado no X
  const maskImage = useTransform(x, (currentX: number) => {
    const itemWidth = 220 + 16;
    const totalWidth = projects.length * itemWidth - 16;
    const maxScroll = Math.max(0, totalWidth - containerWidth);
    const threshold = 55;

    const showLeft = currentX < -threshold;
    const showRight = -currentX < maxScroll - threshold;

    return `linear-gradient(to right, ${
      showLeft ? "transparent 0%, black 10%" : "black 0%"
    }, black 50%, ${showRight ? "black 90%, transparent 100%" : "black 100%"})`;
  });

  // Autoplay com loop infinito
  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [projects.length]);

  // Atualizar posição do drag quando mudar o slide (só quando clicar, não no drag livre)
  useEffect(() => {
    if (shouldAutoScroll && !isDragging && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = 220 + 16; // width + gap
      const totalWidth = projects.length * itemWidth - 16; // total width minus last gap
      const maxScroll = totalWidth - container.clientWidth;

      const itemPosition = currentSlide * itemWidth;
      const itemCenter = itemPosition + itemWidth / 2;
      const containerCenter = container.clientWidth / 2;
      let targetX = -(itemCenter - containerCenter);

      // Limitar o scroll para não ultrapassar os limites
      // Quando está no início, não centraliza (fica em 0)
      // Quando está no fim, não centraliza (fica no máximo)
      targetX = Math.max(-maxScroll, Math.min(0, targetX));

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      });
      setShouldAutoScroll(false);
    }
  }, [currentSlide, isDragging, shouldAutoScroll, x, projects.length]);

  const handleProjectClick = (index: number) => {
    if (!isDragging) {
      setCurrentSlide(index);
      setShouldAutoScroll(true);

      // Resetar autoplay quando clicar manualmente
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }

      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
        setShouldAutoScroll(true);
      }, 5000);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    // Para animações em andamento quando começar a arrastar
    x.stop();
    dragStartX.current = x.get();
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);

    // Resetar autoplay
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
      setShouldAutoScroll(true);
    }, 5000);
  };

  return (
    <div
      className={cn(
        "inset-0 bg-neutral-950 py-20 flex flex-col items-center gap-8 relative",
        "[background-size:10px_10px]",
        "bg-[radial-gradient(rgba(128,51,230,0.3)_1px,transparent_1px)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent,black)]"></div>

      <div className="z-10 flex flex-col items-center gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-neutral-400 text-2xl font-light leading-0 text-center">
            Melhores
          </h2>
          <h1 className="text-6xl font-bold text-neutral-100 text-center">
            Projetos
          </h1>
        </motion.div>

        <div className="w-3/4 flex flex-col gap-6">
          {/* Carousel */}
          <motion.div
            className="overflow-hidden relative"
            style={{
              maskImage: maskImage,
              WebkitMaskImage: maskImage,
            }}
          >
            <div
              ref={scrollContainerRef}
              className="relative overflow-visible cursor-grab active:cursor-grabbing"
            >
              <motion.div
                drag="x"
                dragConstraints={{
                  left: -(projects.length * (220 + 16) - 16 - containerWidth),
                  right: 0,
                }}
                dragElastic={0.1}
                dragMomentum={true}
                dragTransition={{
                  power: 0.1, // Responsividade do arraste
                  timeConstant: 200,
                  modifyTarget: (target) => {
                    // 1. Calcular para onde o scroll iria naturalmente (target)
                    const itemWidth = 220 + 16;
                    const totalWidth = projects.length * itemWidth - 16;
                    const maxScroll = Math.max(0, totalWidth - containerWidth);
                    const containerCenter = containerWidth / 2;

                    // 2. Encontrar qual slide estaria mais próximo do centro nessa posição
                    let closestIndex = 0;
                    let minDistance = Infinity;

                    projects.forEach((_, index) => {
                      const itemPosition = index * itemWidth;
                      const itemCenter = itemPosition + itemWidth / 2;
                      const centerOffset = itemCenter - containerCenter; // Quanto o item precisa deslocar para ficar no centro

                      // Posição alvo ideal para este item
                      // Clamp para respeitar as bordas (não centralizar extremos se não der)
                      const itemTargetX = Math.max(
                        -maxScroll,
                        Math.min(0, -centerOffset)
                      );

                      const distance = Math.abs(target - itemTargetX);

                      if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                      }
                    });

                    // 3. Retornar a posição exata desse slide "vencedor"
                    const itemPosition = closestIndex * itemWidth;
                    const itemCenter = itemPosition + itemWidth / 2;
                    const centerOffset = itemCenter - containerCenter;
                    const snapX = Math.max(
                      -maxScroll,
                      Math.min(0, -centerOffset)
                    );

                    return snapX;
                  },
                }}
                onDragStart={handleDragStart}
                onDragEnd={(e, info) => {
                  handleDragEnd(e, info);
                }}
                style={{ x }}
                className="flex gap-4 select-none"
              >
                {projects.map((project, index) => {
                  const isActive = currentSlide === index;
                  const distance = Math.abs(index - currentSlide);

                  return (
                    <motion.div
                      key={index}
                      onClick={() => handleProjectClick(index)}
                      className="flex-shrink-0 w-55 aspect-video rounded-sm overflow-hidden cursor-pointer select-none relative"
                      animate={{
                        scale: 1,
                        opacity: isActive ? 1 : 0.8,
                        filter: isActive ? "blur(0px)" : "blur(1px)",
                        rotateY: isActive ? 0 : index < currentSlide ? -8 : 8,
                        z: isActive ? 50 : -distance * 20,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8,
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: 1000,
                      }}
                    >
                      <div
                        className="relative w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${project.image})` }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          animate={{
                            opacity: isActive ? 0.8 : 1,
                          }}
                        />

                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-3"
                          animate={{
                            opacity: isActive ? 1 : 0.6,
                          }}
                        >
                          <h3 className="font-bold text-neutral-100 text-base leading-tight">
                            {project.title}
                          </h3>
                        </motion.div>

                        {/* Glow effect on active */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              style={{
                                boxShadow:
                                  "0 0 30px 5px rgba(168, 85, 247, 0.4)",
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

          {/* Project Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="grid grid-cols-2 gap-6"
            >
              <motion.div
                className="w-full aspect-video"
                layoutId="project-preview"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Safari
                  url="https://dnowdd.com"
                  imageSrc={currentProject.image}
                  mode="simple"
                />
              </motion.div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <motion.h2
                    className="text-neutral-100 text-4xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentProject.title}
                  </motion.h2>
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentProject.links.map((link, index) => (
                      <Link key={index} href={link.url}>
                        <Button
                          variant="outline"
                          className="size-8 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <link.icon />
                        </Button>
                      </Link>
                    ))}
                  </motion.div>
                </div>

                <motion.p
                  className="text-neutral-400 text-lg line-clamp-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentProject.description}
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentProject.tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Badge
                        variant="outline"
                        className="border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-purple-500/50 hover:bg-purple-950/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
