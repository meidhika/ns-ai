"use client";

import { useState } from "react";
import { FileCode2, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CodeAttachmentProps {
  mode: "input" | "view";
  initialCode?: string;
  initialFilename?: string;
  onCodeChange?: (code: string) => void;
  onFilenameChange?: (filename: string) => void;
}

export default function CodeAttachment({
  mode,
  initialCode = "",
  initialFilename = "script.js",
  onCodeChange,
  onFilenameChange,
}: CodeAttachmentProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [filename, setFilename] = useState(initialFilename);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode === "input") {
    return (
      <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-muted/30 w-full max-w-2xl">
        <div className="flex items-center px-3 py-2 bg-muted border-b border-border gap-2">
          <FileCode2 size={16} className="text-muted-foreground" />
          <Input
            value={filename}
            onChange={(e) => {
              setFilename(e.target.value);
              onFilenameChange?.(e.target.value);
            }}
            placeholder="nama_file.js"
            className="h-7 text-xs font-mono bg-background border-border w-48"
          />
        </div>
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            onCodeChange?.(e.target.value);
          }}
          placeholder="Ketik kode Anda di sini..."
          className="w-full h-40 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-[#1e1e1e] text-slate-50 w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 text-xs font-mono text-slate-300 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileCode2 size={14} />
          <span>{filename}</span>
        </div>
        <button
          onClick={handleCopy}
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Copy size={14} />
          )}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
