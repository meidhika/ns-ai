"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/routing";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LANGUAGES, LocaleCode } from "@/constants/languages";
import { AI_PROVIDERS, AIModel } from "@/constants/model";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const { setTheme } = useTheme();
  const locale = useLocale() as LocaleCode; 
  const router = useRouter();
  const pathname = usePathname();

  const [selectedModel, setSelectedModel] = useState<AIModel>(
    AI_PROVIDERS[0].models[0],
  );

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const changeLanguage = (newLocale: LocaleCode) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 backdrop-blur-sm bg-background/80 z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {isSidebarOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 px-3 gap-2 font-medium text-sm border border-transparent hover:border-border"
            >
              <Sparkles size={16} className="text-secondary" />
              {selectedModel.name}
              <span className="text-muted-foreground text-xs ml-1">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl">
            {AI_PROVIDERS.map((provider) => (
              <DropdownMenuSub key={provider.provider}>
                <DropdownMenuSubTrigger className="rounded-lg">
                  {provider.provider}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl ml-1">
                    {provider.models.map((model) => (
                      <DropdownMenuItem
                        key={model.id}
                        className="rounded-lg cursor-pointer flex items-center justify-between"
                        onClick={() => setSelectedModel(model)}
                      >
                        {model.name}
                        {selectedModel.id === model.id && (
                          <Check size={14} className="text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Sun
                size={18}
                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <Moon
                size={18}
                className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="gap-2 rounded-lg cursor-pointer"
            >
              <Sun size={14} /> Light
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="gap-2 rounded-lg cursor-pointer"
            >
              <Moon size={14} /> Dark
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="gap-2 rounded-lg cursor-pointer"
            >
              <Monitor size={14} /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/signin">
          <Button className="ml-2 gap-2 rounded-full px-4 font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
            <UserCircle size={18} />
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  );
}
