"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Android } from "@/components/ui/android";
import { FullscreenPreview } from "@/components/ui/fullscreen-preview";
import { Lens } from "@/components/ui/lens";
import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/utils";
import { Github, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import texts from "@/content/texts.json";

const AUTOPLAY_INTERVAL_MS = 5000;

const ProjectSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [autoplayPausedByUser, setAutoplayPausedByUser] = useState(false);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartX = useRef(0);

  const x = useMotionValue(0);

  const socialLinks = {
    Github,
    Globe,
  };

  const projects = texts.projects.items;
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

  // Intersection Observer: visibilidade da seção + reset do "pause" quando sai da tela
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const inView = entry.isIntersecting;
        setIsSectionInView(inView);
        if (!inView) setAutoplayPausedByUser(false);
      },
      { threshold: 0.2, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay só quando a seção está visível e nada está pausando:
  // clique do usuário (thumbnail/teclado), mouse sobre o preview ou fullscreen aberto
  useEffect(() => {
    const paused =
      !isSectionInView ||
      autoplayPausedByUser ||
      isPreviewHovered ||
      isFullscreenOpen;

    if (paused) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
      setShouldAutoScroll(true);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [
    isSectionInView,
    autoplayPausedByUser,
    isPreviewHovered,
    isFullscreenOpen,
    projects.length,
  ]);

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
      setAutoplayPausedByUser(true);

      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }
  };

  const handleCarouselKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    const next = (currentSlide + delta + projects.length) % projects.length;
    setCurrentSlide(next);
    setShouldAutoScroll(true);
    setAutoplayPausedByUser(true);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    // Para animações em andamento quando começar a arrastar
    x.stop();
    dragStartX.current = x.get();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Autoplay continua ou não conforme isSectionInView e autoplayPausedByUser (efeito cuida disso)
  };

  return (
    <div
      ref={sectionRef}
      id="projetos"
      className={cn(
        "inset-0 bg-neutral-950 py-20 flex flex-col items-center gap-8 relative overflow-hidden",
        "[background-size:10px_10px]",
        "bg-[radial-gradient(rgba(128,51,230,0.3)_1px,transparent_1px)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent,black)]"></div>

      <div className="z-10 flex flex-col items-center gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <TextAnimate
            animation="slideUp"
            by="character"
            className="text-neutral-400 text-xl md:text-2xl font-light leading-0 text-center"
          >
            {texts.projects.subtitle}
          </TextAnimate>
          <TextAnimate
            as="h2"
            animation="slideUp"
            by="character"
            className="text-4xl md:text-6xl font-bold text-neutral-100 text-center"
          >
            {texts.projects.title}
          </TextAnimate>
        </motion.div>

        <div className="w-[90%] md:w-3/4 flex flex-col gap-6">
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
              role="listbox"
              aria-label="Selecionar projeto"
              onKeyDown={handleCarouselKeyDown}
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
                        Math.min(0, -centerOffset),
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
                      Math.min(0, -centerOffset),
                    );

                    return snapX;
                  },
                }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="flex gap-4 select-none"
              >
                {projects.map((project, index) => {
                  const isActive = currentSlide === index;
                  const distance = Math.abs(index - currentSlide);

                  return (
                    <motion.button
                      key={index}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      aria-label={`Ver projeto ${project.title}`}
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
                      <div className="relative w-full h-full">
                        <Image
                          src={project.image}
                          alt={`Captura de tela do projeto ${project.title}`}
                          fill
                          sizes="220px"
                          draggable={false}
                          className="object-cover"
                        />
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
                          <p className="font-bold text-neutral-100 text-base leading-tight text-left">
                            {project.title}
                          </p>
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
                    </motion.button>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div
                className="w-full aspect-video"
                layoutId="project-preview"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseEnter={() => setIsPreviewHovered(true)}
                onMouseLeave={() => setIsPreviewHovered(false)}
              >
                <FullscreenPreview
                  imageSrc={currentProject.image}
                  alt={currentProject.title}
                  className="size-full"
                  onOpenChange={setIsFullscreenOpen}
                >
                  <Lens
                    className="size-full"
                    zoomFactor={1.5}
                    lensSize={200}
                  >
                    <div
                      className={cn(
                        "size-full",
                        (currentProject as { mobileApp?: boolean }).mobileApp
                          ? "flex items-center justify-center"
                          : ""
                      )}
                    >
                      {(currentProject as { mobileApp?: boolean }).mobileApp ? (
                        <Android
                          src={currentProject.image}
                          className="h-full w-auto"
                        />
                      ) : (
                        <Safari
                          url="https://dnowdd.com"
                          imageSrc={currentProject.image}
                          mode="simple"
                        />
                      )}
                    </div>
                  </Lens>
                </FullscreenPreview>
              </motion.div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <motion.h3
                    className="text-neutral-100 text-4xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentProject.title}
                  </motion.h3>
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {currentProject.links?.map((link, index) => {
                      const Icon =
                        socialLinks[link.icon as keyof typeof socialLinks];
                      if (!Icon) return null;

                      const label =
                        link.icon === "Github"
                          ? `Repositório de ${currentProject.title} no GitHub`
                          : `Site do projeto ${currentProject.title}`;

                      return (
                        <Link
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                        >
                          <Button
                            variant="outline"
                            className="size-8 cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Icon aria-hidden />
                          </Button>
                        </Link>
                      );
                    })}
                  </motion.div>
                </div>

                <motion.p
                  className="text-neutral-400 text-sm lg:text-lg line-clamp-7"
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
