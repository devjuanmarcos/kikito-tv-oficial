"use client";

import { Check, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import FlagIcon from "react-flagkit";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { languages } from "@/constants/languages";
import { cn } from "@/lib/utils";

import { Button } from "./button";

export function ComboboxLanguage({
  locale,
  type,
  existsInThisLanguage: _existsInThisLanguage,
  iconOnly = false,
}: Readonly<{ locale: string; type: "header" | "page"; existsInThisLanguage?: boolean; iconOnly?: boolean }>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const priorityValues = ["pt", "en", "es", "de", "it", "fr"];
  const currentLanguageLabel = languages.find((lang) => lang.value === locale)?.label ?? locale.toUpperCase();
  const languageButtonLabel = iconOnly
    ? `Selecionar idioma. Atual: ${currentLanguageLabel}`
    : t("ObraPage.buttons.linguagemObra.text");

  const filteredLanguages = languages.filter((lang) => lang.label.toLowerCase().includes(search.toLowerCase()));

  const priorityLanguages = priorityValues.map((val) => filteredLanguages.find((l) => l.value === val)).filter(Boolean);

  const otherLanguages = filteredLanguages.filter((lang) => !priorityValues.includes(lang.value));

  const handleLanguageChange = (newValue: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    let newPath: string;

    if (type === "page") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set("obraLocale", newValue);
      newPath = `/${newValue}${pathWithoutLocale}?${params.toString()}`;
    } else {
      newPath = `/${newValue}${pathWithoutLocale}`;
    }

    setOpen(false);
    setSearch("");
    router.push(newPath);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex gap-2 h-full items-center"
          variant="outline"
          aria-label={languageButtonLabel}
          title={languageButtonLabel}
        >
          <FlagIcon
            size={type === "page" && !iconOnly ? 32 : 19}
            country={languages.find((lang) => lang.value === locale)?.icon}
          />
          {type === "page" && !iconOnly && t("ObraPage.buttons.linguagemObra.text")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0 flex flex-col" align="end">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-9 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Pesquisar idioma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto p-1 custom-scrollbar">
          {filteredLanguages.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">Nenhum idioma encontrado.</div>
          )}

          {priorityLanguages.length > 0 && (
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Principais</div>
          )}
          {priorityLanguages.map((lang) => (
            <button
              key={`priority-${lang!.value}`}
              onClick={() => handleLanguageChange(lang!.value)}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                locale === lang!.value ? "bg-accent/50" : ""
              )}
            >
              <div className="flex items-center gap-2">
                <Check className={cn("h-4 w-4", locale === lang!.value ? "opacity-100" : "opacity-0")} />
                {lang!.label}
              </div>
              <FlagIcon size={17} country={lang!.icon} />
            </button>
          ))}

          {otherLanguages.length > 0 && (
            <>
              <div className="my-1 h-px bg-border" />
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Todos os idiomas</div>
            </>
          )}
          {otherLanguages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleLanguageChange(lang.value)}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                locale === lang.value ? "bg-accent/50" : ""
              )}
            >
              <div className="flex items-center gap-2">
                <Check className={cn("h-4 w-4", locale === lang.value ? "opacity-100" : "opacity-0")} />
                {lang.label}
              </div>
              <FlagIcon size={17} country={lang.icon} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
