import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body className="antialiased dark">
        <main className="min-h-dvh bg-neutral-950 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="text-neutral-500 font-mono text-sm tracking-widest">404</p>
          <Link
            href="/"
            className="rounded-md border border-neutral-800 bg-neutral-900 px-6 py-3 text-neutral-200 transition-colors hover:border-purple-500/50"
          >
            dnowdd.com
          </Link>
        </main>
      </body>
    </html>
  );
}
