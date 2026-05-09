"use client";

import { motion } from "framer-motion";
import { MessageSquare, Plus, PanelLeftClose } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface SidebarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export default function Sidebar({
  toggleSidebar,
  isSidebarOpen,
  isMobile,
}: SidebarProps) {
  const t = useTranslations("Chat");

  const sidebarWidth = isMobile
    ? isSidebarOpen
      ? 280
      : 0
    : isSidebarOpen
      ? 280
      : 80;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-full border-r border-border bg-muted/30 flex flex-col flex-shrink-0 overflow-hidden shadow-xl md:shadow-none ${
        isMobile ? "fixed inset-y-0 left-0 z-30 bg-background" : "relative z-20"
      }`}
    >
      <div className="h-14 flex items-center px-4 mb-2 shrink-0">
        {isSidebarOpen ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <Image
                src="/icons/ns-ai-logo.png"
                alt="NS AI Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain shrink-0"
              />
              <span className="font-bold tracking-tight text-foreground text-lg whitespace-nowrap overflow-hidden">
                NS AI
              </span>
            </div>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <PanelLeftClose size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Image
              src="/icons/ns-ai-logo.png"
              alt="NS AI Logo"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col items-center shrink-0">
        {isSidebarOpen ? (
          <button className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-border bg-background shadow-sm whitespace-nowrap overflow-hidden">
            <Plus size={18} className="shrink-0" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        ) : (
          <button
            onClick={isMobile ? undefined : toggleSidebar}
            className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-border bg-background shadow-sm"
          >
            <Plus size={22} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {isSidebarOpen ? (
          <>
            <p className="text-xs text-muted-foreground font-semibold mb-3 px-2">
              Recent
            </p>
            <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted transition-colors text-left overflow-hidden">
              <MessageSquare
                size={16}
                className="text-muted-foreground shrink-0"
              />
              <span className="text-sm truncate">Apa itu Gemini?</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button className="p-3 rounded-md hover:bg-muted transition-colors">
              <MessageSquare size={20} className="text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
