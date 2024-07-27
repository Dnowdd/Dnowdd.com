import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {theme === "dark" ? (
        <div
          onClick={() => setTheme("light")}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "size-12 rounded-full"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Sun size={18} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Light</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div
          onClick={() => setTheme("dark")}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "size-12 rounded-full"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Moon size={18} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Dark</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
}

{
  /*  */
}
