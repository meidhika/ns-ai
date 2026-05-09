"use client";

import { User, Bot, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import CodeAttachment from "./attachments/CodeAttachment";
import CanvasAttachment from "./attachments/CanvasAttachment";
import AudioAttachment from "./attachments/AudioAttachment";
import VideoAttachment from "./attachments/VideoAttachment";

export type AttachmentType = "code" | "canvas" | "audio" | "video";

export interface Attachment {
  type: AttachmentType;
  content: string;
  metadata?: { filename?: string };
}

export interface MessageProps {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  userName?: string;
  userImage?: string;
  isStaging?: boolean;
  onAttachmentUpdate?: (index: number, data: Attachment) => void;
  onCancelAttachment?: (index: number) => void;
}

export default function ChatMessage({
  role,
  content,
  attachments,
  userName,
  userImage,
  isStaging,
  onAttachmentUpdate,
  onCancelAttachment,
}: MessageProps) {
  const isAi = role === "assistant";

  return (
    <div className={`flex w-full gap-4 py-4 ${isAi ? "" : "flex-row-reverse"}`}>
      <Avatar className="h-8 w-8 shrink-0 mt-1 border border-border shadow-sm">
        {isAi ? (
          <>
            <AvatarImage
              src="/icons/ns-ai-logo.png"
              className="p-1 object-contain bg-primary/10"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              <Bot size={18} />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-muted-foreground/20 text-muted-foreground">
            <User size={18} />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={`flex flex-col max-w-[85%] md:max-w-[75%] gap-2 ${isAi ? "items-start" : "items-end"}`}
      >
        {content && (
          <div
            className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
              isAi
                ? "bg-muted/50 text-foreground rounded-tl-sm border border-border/50"
                : "bg-primary text-primary-foreground rounded-tr-sm"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          </div>
        )}

        {attachments && attachments.length > 0 && (
          <div className="flex flex-col gap-3 w-full mt-1">
            {attachments.map((item, idx) => (
              <div
                key={idx}
                className={`relative w-full ${!isAi && "flex justify-end"}`}
              >
                {isStaging && (
                  <button
                    onClick={() => onCancelAttachment?.(idx)} 
                    className="absolute -top-3 -right-3 z-10 bg-destructive text-destructive-foreground p-1 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <X size={14} />
                  </button>
                )}

                {item.type === "code" && (
                  <CodeAttachment
                    mode={isStaging ? "input" : "view"}
                    initialCode={item.content}
                    initialFilename={item.metadata?.filename}
                    onCodeChange={(code) =>
                      onAttachmentUpdate?.(idx, { ...item, content: code })
                    }
                    onFilenameChange={(filename) =>
                      onAttachmentUpdate?.(idx, {
                        ...item,
                        metadata: { ...item.metadata, filename },
                      })
                    }
                  />
                )}

                {item.type === "canvas" && (
                  <CanvasAttachment
                    mode={isStaging ? "input" : "view"}
                    initialImage={item.content}
                    onSave={(dataUrl) =>
                      onAttachmentUpdate?.(idx, { ...item, content: dataUrl })
                    }
                  />
                )}

                {item.type === "audio" && (
                  <AudioAttachment
                    mode={isStaging ? "input" : "view"}
                    src={item.content}
                  />
                )}

                {item.type === "video" && (
                  <VideoAttachment
                    mode={isStaging ? "input" : "view"}
                    src={item.content}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
