import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("dark")}>Deixar tema escuro</button>
      <button onClick={() => setTheme("light")}>Deixar tema claro</button>
    </div>
  );
}
