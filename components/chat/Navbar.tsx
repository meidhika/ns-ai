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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AI_PROVIDERS, AIModel } from "@/constants/model";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import ThemeToggle from "../ui/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(
    AI_PROVIDERS[0].models[0],
  );
  const { data: session, status } = useSession();
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
        <LanguageSwitcher />
        <ThemeToggle />
        {status === "loading" ? (
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse ml-2"></div>
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon" 
                className="relative h-9 w-9 rounded-full ml-2 overflow-hidden border border-border p-0" 
              >
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl mt-1">
              <div className="flex items-center justify-start gap-2 p-3">
                <div className="flex flex-col space-y-1 leading-none">
                  {session.user.name && (
                    <p className="font-semibold text-sm">{session.user.name}</p>
                  )}
                  {session.user.email && (
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signin">
            <Button className="rounded-full px-3 font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
