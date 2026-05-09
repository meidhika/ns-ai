"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SendHorizonal, Plus, FileText, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ChatInput() {
  const t = useTranslations("Chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Fungsi untuk mengatur tinggi textarea secara otomatis
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      // Reset tinggi ke auto terlebih dahulu agar bisa mengecil jika teks dihapus
      textareaRef.current.style.height = "auto";
      // Set tinggi sesuai dengan scrollHeight (tinggi konten aktual)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Fungsi untuk mencegah baris baru jika hanya menekan Enter (untuk submit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // TODO: Panggil fungsi kirim pesan di sini nantinya
      if (inputValue.trim()) {
        console.log("Kirim pesan:", inputValue);
        setInputValue("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // Reset tinggi setelah kirim
        }
      }
    }
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-3xl mx-auto relative">
        <div className="flex items-end gap-2 w-full rounded-2xl border border-border bg-muted/50 p-2 focus-within:ring-1 focus-within:ring-primary focus-within:bg-background transition-all shadow-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground shrink-0 mb-0.5"
              >
                <Plus size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              sideOffset={12}
              className="rounded-xl w-48 mb-2"
            >
              <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer py-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-md">
                  <FileText size={16} />
                </div>
                <span className="font-medium">Upload File</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer py-2">
                <div className="p-1.5 bg-secondary/20 text-secondary-foreground rounded-md">
                  <ImageIcon size={16} />
                </div>
                <span className="font-medium">Create Image</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            className="flex-1 resize-none bg-transparent py-2.5 focus:outline-none min-h-[40px] max-h-[200px] overflow-y-auto text-foreground"
          />

          <Button
            size="icon"
            disabled={!inputValue.trim()}
            className="h-9 w-9 rounded-full shrink-0 mb-0.5 transition-all disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground bg-primary text-primary-foreground hover:opacity-90"
          >
            <SendHorizonal size={18} />
          </Button>
        </div>

        <div className="text-center mt-3">
          <span className="text-[10px] text-muted-foreground font-medium">
            AI can make mistakes. Please verify important information.
          </span>
        </div>
      </div>
    </div>
  );
}
