"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LANGUAGES, LocaleCode } from "@/constants/languages";

export default function LanguageSwitcher() {
  const locale = useLocale() as LocaleCode;
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const changeLanguage = (newLocale: LocaleCode) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full overflow-hidden"
        >
          <Image
            src={currentLanguage.icon}
            alt={currentLanguage.name}
            width={24}
            height={24}
            className="object-cover rounded-sm"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32 rounded-xl">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="gap-3 rounded-lg cursor-pointer"
          >
            <Image
              src={lang.icon}
              alt={lang.name}
              width={20}
              height={20}
              className="rounded-sm object-cover"
            />
            <span className="flex-1">{lang.name}</span>
            {locale === lang.code && (
              <Check size={14} className="text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
