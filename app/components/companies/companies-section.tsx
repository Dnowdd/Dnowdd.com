import { Badge } from "@/components/ui/badge";
import { StarsBackground } from "@/components/ui/stars-background";
import { Timeline } from "@/components/ui/timeline";

const CompaniesSection = () => {
  const timeline = [
    {
      title: (
        <div className="flex flex-col items-end">
          <h1>Ago. 2025</h1>
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-neutral-600"></div>
            <p className="font-light text-lg">Atualmente</p>
          </div>
        </div>
      ),
      content: (
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-neutral-100">
            Desenvolvedor Full-stack Júnior
          </h1>
          <h2 className="text-xl text-neutral-400">Genialogic</h2>
          <p className="text-sm font-light max-w-2/3 text-neutral-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
            dignissimos fugiat rerum suscipit tenetur eligendi itaque quas
            reprehenderit, veritatis qui! Est, eaque incidunt laborum odio nam
            molestias quos delectus sed!
          </p>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="text-neutral-500 bg-neutral-900/50"
            >
              Next.js
            </Badge>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col items-end">
          <h1>Fev. 2024</h1>
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-neutral-600"></div>
            <p className="font-light text-lg">Ago. 2025</p>
          </div>
        </div>
      ),
      content: (
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-neutral-100">
            Estagiário em desenvolvimento de software
          </h1>
          <h2 className="text-xl text-neutral-400">Genialogic</h2>
          <p className="text-sm font-light max-w-2/3 text-neutral-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
            dignissimos fugiat rerum suscipit tenetur eligendi itaque quas
            reprehenderit, veritatis qui! Est, eaque incidunt laborum odio nam
            molestias quos delectus sed!
          </p>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="text-neutral-500 bg-neutral-900/50"
            >
              Next.js
            </Badge>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-neutral-950 py-20 relative z-10">
      <StarsBackground />

      <div>
        <h2 className="text-neutral-400 text-2xl font-light leading-2 text-center">
          Minhas
        </h2>
        <h1 className="text-6xl font-bold text-neutral-100 text-center">
          Experiências
        </h1>
      </div>

      <Timeline data={timeline} />
    </div>
  );
};

export default CompaniesSection;
