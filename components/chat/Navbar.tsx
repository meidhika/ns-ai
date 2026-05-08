"use client";

import { PanelLeftClose, PanelLeftOpen, UserCircle } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 backdrop-blur-sm bg-background/80 z-10 sticky top-0">
      <div className="flex items-center gap-3">
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

        {/* Dummy Model Selector - Nantinya diganti dengan Shadcn Select */}
        <div className="px-3 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border text-sm font-medium">
          Gemini 1.5 Pro <span className="text-muted-foreground ml-1">▼</span>
        </div>
      </div>

      <div className="flex items-center">
        {/* Dummy Login Button - Nantinya menggunakan status dari next-auth */}
        <button className="flex items-center gap-2 p-1.5 px-3 rounded-full hover:bg-muted transition-colors border border-border text-sm font-medium">
          <UserCircle size={18} />
          Login
        </button>
      </div>
    </header>
  );
}
