"use client";

import { motion } from "framer-motion";
import { MessageSquare, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface SidebarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Sidebar({
  toggleSidebar,
  isSidebarOpen,
}: SidebarProps) {
  const t = useTranslations("Chat");

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full border-r border-border bg-muted/30 flex flex-col z-20 flex-shrink-0 overflow-hidden relative"
    >
      {/* === AREA BRANDING (LOGO & TITLE) DI ATAS === */}
      <div className="p-4 flex items-center justify-center mt-2">
        {isSidebarOpen ? (
          <div className="flex items-center gap-3 w-full px-2">
            <Image
              src="/icons/ns-ai-logo.png"
              alt="NS AI Logo"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="font-bold tracking-tight text-foreground text-lg">
              NS AI
            </span>
          </div>
        ) : (
          <Image
            src="/icons/ns-ai-logo.png"
            alt="NS AI Logo"
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
        )}
      </div>

      {/* === AREA TOMBOL NEW CHAT === */}
      <div className="px-4 pb-4 flex items-center justify-center">
        {isSidebarOpen ? (
          <button className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-border bg-background shadow-sm">
            <Plus size={18} />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        ) : (
          <button className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-border bg-background shadow-sm">
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* === AREA HISTORY CHAT === */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
        {isSidebarOpen && (
          <>
            <p className="text-xs text-muted-foreground font-semibold mb-3 px-2">
              Recent
            </p>
            <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted transition-colors text-left">
              <MessageSquare size={16} className="text-muted-foreground" />
              <span className="text-sm truncate">Apa itu React JS?</span>
            </button>
          </>
        )}
      </div>
    </motion.aside>
  );
}
