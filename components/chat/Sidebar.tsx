"use client";

import { motion } from "framer-motion";
import { MessageSquare, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface SidebarProps {
  toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
  const t = useTranslations("Chat");

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full border-r border-border bg-muted/30 flex flex-col z-20 absolute md:relative flex-shrink-0 overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between">
        <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-muted transition-colors border border-border">
          <Plus size={18} />
          <span className="text-sm font-medium">New Chat</span>
        </button>
        {/* Tombol close khusus mobile */}
        <button onClick={toggleSidebar} className="md:hidden ml-2 p-2">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <p className="text-xs text-muted-foreground font-semibold mb-3 px-2">
          Recent
        </p>
        {/* Dummy History Item */}
        <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted transition-colors text-left">
          <MessageSquare size={16} className="text-muted-foreground" />
          <span className="text-sm truncate">Apa itu React JS?</span>
        </button>
      </div>
    </motion.aside>
  );
}
