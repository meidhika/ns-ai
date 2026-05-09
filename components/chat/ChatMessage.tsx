"use client";

import React, { useState } from "react";
import { User, Bot, X, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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

const CodeBlock: Components["code"] = ({
  className,
  children,
  node,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); 
  };

  if (match) {
    return (
      <div className="relative group my-4 rounded-md overflow-hidden bg-[#1E1E1E] border border-border/50">
        <div className="flex items-center justify-between px-4 py-1.5 bg-muted/80 text-xs text-muted-foreground border-b border-border/50">
          <span className="font-mono uppercase">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="hover:text-foreground transition-colors p-1"
            title="Salin kode"
          >
            {isCopied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus as { [key: string]: React.CSSProperties }}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code
      className="bg-muted/80 px-1.5 py-0.5 rounded-md text-sm font-mono border border-border/50"
      {...props}
    >
      {children}
    </code>
  );
};

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
        {content ? (
          <div
            className={`px-4 py-3 rounded-2xl text-sm shadow-sm overflow-x-auto ${
              isAi
                ? "bg-muted/50 text-foreground rounded-tl-sm border border-border/50"
                : "bg-primary text-primary-foreground rounded-tr-sm"
            }`}
          >
            {isAi ? (
              <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ code: CodeBlock }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
            )}
          </div>
        ) : isAi ? (
          <div className="bg-muted/50 px-4 py-3 rounded-2xl text-sm shadow-sm rounded-tl-sm border border-border/50 text-muted-foreground flex items-center gap-1.5 h-11 w-24">
            <span
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
        ) : null}

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
