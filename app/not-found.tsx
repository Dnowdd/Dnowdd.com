import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-neutral-950 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-neutral-500 font-mono text-sm tracking-widest">
        ERRO 404
      </p>
      <h1 className="text-5xl md:text-7xl font-bold text-neutral-100">
        Página não encontrada
      </h1>
      <p className="text-neutral-400 font-light max-w-md">
        O endereço que você tentou acessar não existe. Que tal voltar para o
        início?
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md border border-neutral-800 bg-neutral-900 px-6 py-3 text-neutral-200 transition-colors hover:border-purple-500/50 hover:bg-purple-950/20"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
