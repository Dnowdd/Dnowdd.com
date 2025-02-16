import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@/config/i18n";
import { cn } from "@/lib/utils";
import { Check, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { i18n } = useTranslation();
  const [lang, setLang] = useState<string>(i18n.language);

  const languages = [
    {
      label: "Português (Brasil)",
      value: "pt",
    },
    {
      label: "English",
      value: "en",
    },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLang(lang);
    setOpen(false);
  };

  useEffect(() => {
    document.title = t("title");
  }, [lang]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "size-12 rounded-full"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Languages size={18} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Language</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  value={language.label}
                  key={language.value}
                  onSelect={() => {
                    changeLanguage(language.value);
                  }}
                >
                  {language.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      language.value === lang ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
