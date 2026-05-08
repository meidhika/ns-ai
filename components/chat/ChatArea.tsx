"use client";

import { useTranslations } from "next-intl";
import { SendHorizonal } from "lucide-react";

export default function ChatArea() {
  const t = useTranslations("Chat");

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Area Pesan */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-center h-full text-center space-y-4 flex-col opacity-50">
          {/* Tampilan awal jika belum ada chat */}
          <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">NS</span>
          </div>
          <h2 className="text-2xl font-semibold">{t("title")}</h2>
          <p className="text-sm max-w-md">{t("loginToSave")}</p>
        </div>
      </div>

      {/* Area Input Container */}
      <div className="p-4 bg-background">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <textarea
            rows={1}
            placeholder={t("placeholder")}
            className="w-full resize-none rounded-2xl border border-border bg-muted/50 pl-4 pr-12 py-4 focus:outline-none focus:ring-1 focus:ring-ring focus:bg-background transition-all min-h-[56px] max-h-[200px]"
          />
          <button className="absolute right-3 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
            <SendHorizonal size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-muted-foreground">
            AI can make mistakes. Please verify important information.
          </span>
        </div>
      </div>
    </div>
  );
}
