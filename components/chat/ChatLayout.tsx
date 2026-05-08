"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ChatArea from "./ChatArea";

export default function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      <AnimatePresence mode="wait">
        {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
      </AnimatePresence>

      <div className="flex flex-1 flex-col h-full w-full relative">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <ChatArea />
      </div>
    </>
  );
}
