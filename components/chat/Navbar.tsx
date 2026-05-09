"use client";

import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle,
  Sparkles,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/routing";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AI_PROVIDERS, AIModel } from "@/constants/model";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import ThemeToggle from "../ui/ThemeToggle";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(
    AI_PROVIDERS[0].models[0],
  );

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
        <LanguageSwitcher />
        <ThemeToggle />
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
