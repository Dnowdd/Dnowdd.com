import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface CardProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  tags?: string[];
  github?: string;
  website?: string;
  mobile?: boolean;
  projectImage?: string;
}

export default function CardProject({
  title,
  description,
  tags,
  github,
  website,
  mobile = false,
  projectImage,
  ...props
}: CardProjectProps) {
  const [hover, setHover] = useState(false);

  return (
    <>
      <AnimatePresence>
        {hover && (
          <div className="fixed bottom-0 left-0 w-1/2 py-20 px-40">
            <motion.div
              className={`rounded-xl overflow-auto shadow-2xl overflow-hidden ${
                mobile
                  ? "aspect-9/16 max-w-[200px]"
                  : "w-full aspect-radio max-h-[350px]"
              }`}
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
      <Dialog>
        <DialogTrigger>
          <div
            className="rounded-xl border px-4 py-6 flex flex-col gap-4 select-none cursor-pointer transition hover:scale-[1.01] hover:shadow-lg"
            {...props}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-xl line-clamp-1">{title}</h1>
              <p className="line-clamp-2 overflow-hidden text-ellipsis text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            </div>
            <div className="mt-auto mx-auto flex gap-2 overflow-x-hidden w-full">
              {tags &&
                tags.map((tag, index) => (
                  <Badge variant="outline" key={index}>
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </DialogTrigger>
        {(github || website) && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-left gap-2">
              {github && (
                <a href={github} target="_blank" rel="noreferrer">
                  <Button>
                    <FaGithub /> Github
                  </Button>
                </a>
              )}
              {website && (
                <a href={website} target="_blank" rel="noreferrer">
                  <Button>
                    <TbWorld /> Website
                  </Button>
                </a>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
