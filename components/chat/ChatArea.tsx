"use client";

import { useTranslations } from "next-intl";
import ChatInput from "./ChatInput"; 

export default function ChatArea() {
  const t = useTranslations("Chat");

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-center h-full text-center space-y-4 flex-col opacity-50">
          <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4 shadow-sm">
            <span className="text-2xl font-bold text-foreground">NS</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm max-w-md text-muted-foreground">
            {t("loginToSave")}
          </p>
        </div>
      </div>
      <ChatInput />
    </div>
  );
}
