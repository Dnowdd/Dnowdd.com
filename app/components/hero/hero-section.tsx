import FluidWaves from "./components/fluid-waves";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-neutral-950 overflow-hidden flex items-center justify-center h-screen">
      {/* Content */}
      <div className="flex flex-col gap-4 items-start z-10">
        <div className="flex flex-col font-light tracking-wide items-start">
          <h1 className="text-neutral-400 text-4xl font-light leading-0">
            Queiroz,
          </h1>
          <h2 className="text-9xl font-bold text-neutral-100">David</h2>
        </div>
        <p className="text-neutral-400 text-lg font-light tracking-wide max-w-3xl">
          Sou um{" "}
          <strong className="font-semibold">
            desenvolvedor full-stack brasileiro
          </strong>{" "}
          com experiência prática desde 2020, movido pela curiosidade e pelo
          desejo de transformar ideias criativas em{" "}
          <strong className="font-semibold">
            soluções tecnológicas eficientes
          </strong>{" "}
          e <strong className="font-semibold">impactantes</strong>. Ao longo da
          minha trajetória, desenvolvi uma forte paixão por utilizar o código
          como ferramenta para resolver problemas reais, melhorar processos e
          gerar valor para pessoas e organizações.
        </p>
        <p className="text-neutral-400 text-lg font-light tracking-wide max-w-3xl">
          Atualmente, atuo como{" "}
          <strong className="font-semibold">
            Desenvolvedor Full-Stack Júnior
          </strong>{" "}
          na <strong className="font-semibold">Genialogic</strong>, cargo que
          assumi em agosto de 2025, após 1 ano e meio de experiência como
          estagiário, iniciado em fevereiro de 2024. Nesse período, tive a
          oportunidade de aprofundar minhas habilidades técnicas, participar
          ativamente de projetos reais e evoluir tanto no desenvolvimento{" "}
          <strong className="font-semibold">frontend</strong> quanto{" "}
          <strong className="font-semibold">backend</strong>, sempre com foco em
          soluções escaláveis e bem estruturadas.
        </p>
        <p className="text-neutral-400 text-lg font-light tracking-wide max-w-3xl">
          Sou <strong className="font-semibold">formado</strong> em{" "}
          <strong className="font-semibold">
            Gestão da Tecnologia da Informação
          </strong>{" "}
          pela <strong className="font-semibold">FATEC Campinas</strong>, curso
          iniciado em 2023 e concluído em dezembro de 2025. Essa formação
          fortaleceu minha visão estratégica sobre tecnologia, negócios e
          processos, complementando minha experiência prática como
          desenvolvedor.
        </p>
      </div>

      {/* Fluid Waves */}
      <FluidWaves />
    </section>
  );
}
