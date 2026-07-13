"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { useInView } from "motion/react";
import texts from "@/content/texts.json";

// Three.js fica fora do bundle inicial; cena é decorativa e só roda no cliente
const AsciiCanvas = dynamic(() => import("./components/ascii-canvas"), {
  ssr: false,
});

const SocialmediasSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const socialLinks = {
    Linkedin,
    Github,
    Mail,
  };

  return (
    <div
      ref={sectionRef}
      className="w-full bg-neutral-950 flex flex-col md:grid md:grid-cols-[2fr_1fr] items-center px-4 md:px-8 relative py-20 md:py-0 z-[2]"
    >
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 70%, 65%, .08) 0, hsla(270, 70%, 55%, .02) 50%, hsla(270, 70%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 70%, 65%, .06) 0, hsla(270, 70%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 70%, 65%, .04) 0, hsla(270, 70%, 45%, .02) 80%, transparent 100%)"
        className="opacity-20! xl:opacity-70! z-20!"
        only="left"
      />

      <div className="flex flex-col gap-6 px-4 md:pl-30 z-30 relative w-full pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <h2 className="text-4xl md:text-6xl font-bold">
            <EncryptedText
              text={texts.socialmedias.title}
              encryptedClassName="text-neutral-400"
              revealedClassName="text-neutral-100"
              revealDelayMs={50}
            />
          </h2>
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-neutral-400 text-lg font-light max-w-140 drop-shadow-md md:drop-shadow-none"
          >
            {texts.socialmedias.description}
          </TextAnimate>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          {texts.socialmedias.links.map((link, index) => {
            const Icon = socialLinks[link.icon as keyof typeof socialLinks];
            return (
              <Link key={index} target="_blank" href={link.href} rel="noopener noreferrer">
                <Button className="bg-neutral-950 hover:bg-neutral-900 border text-neutral-400 cursor-pointer opacity-90 hover:opacity-100">
                  <Icon />
                  {link.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center md:justify-end opacity-30 xl:opacity-100 xl:relative xl:block xl:h-80 pointer-events-none z-0">
        <div className="w-full md:w-1/2 h-80 xl:h-120 xl:-translate-y-20 relative">
          <AsciiCanvas isVisible={isInView} />
        </div>
      </div>
    </div>
  );
};

export default SocialmediasSection;
