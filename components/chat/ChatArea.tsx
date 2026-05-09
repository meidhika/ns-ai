"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ChatInput from "./ChatInput";
import ChatMessage, {
  Attachment,
  MessageProps,
  AttachmentType,
} from "./ChatMessage";

export default function ChatArea() {
  const t = useTranslations("Chat");
  const [chats, setChats] = useState<MessageProps[]>([]);
  const [stagingAttachments, setStagingAttachments] = useState<Attachment[]>(
    [],
  );

  const handleSendMessage = (text: string) => {
    if (!text.trim() && stagingAttachments.length === 0) return;

    const newMessage: MessageProps = {
      role: "user",
      content: text,
      attachments: stagingAttachments.length > 0 ? [...stagingAttachments] : [],
    };

    setChats((prev) => [...prev, newMessage]);
    setStagingAttachments([]); 
  };

  const handleAddAttachment = (type: AttachmentType) => {
    setStagingAttachments((prev) => [
      ...prev,
      {
        type,
        content: "",
        metadata: { filename: type === "code" ? "script.js" : undefined },
      },
    ]);
  };

  const handleUpdateAttachment = (index: number, updatedData: Attachment) => {
    setStagingAttachments((prev) => {
      const newArr = [...prev];
      newArr[index] = updatedData;
      return newArr;
    });
  };

  const handleCancelAttachment = (index: number) => {
    setStagingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
        {chats.length === 0 && stagingAttachments.length === 0 ? (
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
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-6 pb-4">
            {chats.map((chat, index) => (
              <ChatMessage key={index} {...chat} />
            ))}

            {stagingAttachments.length > 0 && (
              <div className="relative animate-in fade-in slide-in-from-bottom-4">
                <ChatMessage
                  role="user"
                  content=""
                  attachments={stagingAttachments}
                  isStaging={true}
                  onAttachmentUpdate={handleUpdateAttachment}
                  onCancelAttachment={handleCancelAttachment}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onAddAttachment={handleAddAttachment}
        stagingAttachments={stagingAttachments}
      />
    </div>
  );
}
