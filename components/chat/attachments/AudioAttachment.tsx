"use client";

import { Play } from "lucide-react";

export default function AudioAttachment({
  src,
  mode,
}: {
  src?: string;
  mode: "input" | "view";
}) {
  return (
    <div
      className={`p-3 rounded-xl border border-border bg-muted/50 shadow-sm flex items-center gap-3 ${mode === "input" ? "w-72" : "w-full max-w-sm"}`}
    >
      <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md">
        <Play size={18} className="ml-1" />
      </button>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div className="w-1/3 h-full bg-primary rounded-full animate-pulse"></div>
      </div>
      <span className="text-xs font-medium text-muted-foreground mr-2">
        Audio
      </span>
    </div>
  );
}
