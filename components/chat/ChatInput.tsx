"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SendHorizonal, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Attachment, AttachmentType } from "./ChatMessage";
import FilePreviewList, { UploadedFile } from "./FilePreviewList";
import ChatInputMenu from "./ChatInputMenu";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onAddAttachment: (type: AttachmentType) => void;
  stagingAttachments: Attachment[];
}

export default function ChatInput({
  onSendMessage,
  onAddAttachment,
  stagingAttachments,
}: ChatInputProps) {
  const t = useTranslations("Chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isCreateImageMode, setIsCreateImageMode] = useState<boolean>(false);

  const isStagingActive = stagingAttachments.length > 0;
  const totalCount = stagingAttachments.length;
  const hasCanvas = stagingAttachments.some((a) => a.type === "canvas");
  const hasVideo = stagingAttachments.some((a) => a.type === "video");

  const isMaxTotalReached = totalCount >= 5;
  const canAddCodeAudio = !isMaxTotalReached;
  const canAddCanvas = !isMaxTotalReached && !hasCanvas;
  const canAddVideo = !isMaxTotalReached && !hasVideo;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUploads = filesArray.map((file) => ({
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));
      setUploadedFiles((prev) => [...prev, ...newUploads]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => {
      const updated = [...prev];
      if (updated[index].previewUrl)
        URL.revokeObjectURL(updated[index].previewUrl!);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSend = () => {
    if (
      !inputValue.trim() &&
      !isStagingActive &&
      uploadedFiles.length === 0 &&
      !isCreateImageMode
    )
      return;

    onSendMessage(inputValue);

    setInputValue("");
    setUploadedFiles([]);
    setIsCreateImageMode(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    if (isCreateImageMode) return "Deskripsikan gambar yang ingin Anda buat...";
    if (isStagingActive) return `Menyiapkan ${totalCount}/5 lampiran...`;
    return t("placeholder");
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-3xl mx-auto relative">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />

        <div className="flex flex-col w-full rounded-3xl border border-border bg-muted/30 p-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:bg-background transition-all shadow-sm">
          <FilePreviewList
            files={uploadedFiles}
            onRemove={removeUploadedFile}
          />

          <div className="flex items-end gap-2 w-full p-0.5">
            <ChatInputMenu
              onUploadClick={() => fileInputRef.current?.click()}
              onCreateImageClick={() => setIsCreateImageMode(true)}
              isCreateImageMode={isCreateImageMode}
              onAddAttachment={onAddAttachment}
              canAddCodeAudio={canAddCodeAudio}
              canAddCanvas={canAddCanvas}
              canAddVideo={canAddVideo}
            />

            {isCreateImageMode && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 mb-1.5 animate-in slide-in-from-left-2 shadow-sm">
                <ImageIcon size={14} />
                Create Image
                <button
                  onClick={() => setIsCreateImageMode(false)}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-500/20 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className="flex-1 resize-none bg-transparent py-2 px-1 focus:outline-none min-h-[40px] max-h-[200px] overflow-y-auto text-foreground text-sm"
            />

            <Button
              size="icon"
              onClick={handleSend}
              disabled={
                !inputValue.trim() &&
                !isStagingActive &&
                uploadedFiles.length === 0 &&
                !isCreateImageMode
              }
              className="h-9 w-9 rounded-full shrink-0 mb-0.5 transition-all disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground bg-primary text-primary-foreground hover:opacity-90"
            >
              <SendHorizonal size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
