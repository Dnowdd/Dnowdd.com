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

interface CardProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  tags?: string[];
  github?: string;
  website?: string;
}

export default function CardProject({
  title,
  description,
  tags,
  github,
  website,
  ...props
}: CardProjectProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="rounded-xl border px-4 py-6 flex flex-col gap-4 select-none cursor-pointer transition hover:scale-[1.01] hover:shadow-lg"
          {...props}
        >
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-xl">{title}</h1>
            <p className="line-clamp-2 overflow-hidden text-ellipsis text-neutral-500">
              {description}
            </p>
          </div>
          <div className="mt-auto mx-auto flex gap-2 flex-wrap">
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
  );
}
