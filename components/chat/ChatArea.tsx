"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ChatInput from "./ChatInput";
import ChatMessage, {
  Attachment,
  MessageProps,
  AttachmentType,
} from "./ChatMessage";
import { useChatStore } from "@/store/useChatStore";
import { useParams, useRouter } from "next/navigation";

export default function ChatArea() {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const {
    selectedModel,
    guestId,
    chatId,
    setChatId,
    chats,
    setChats,
    addMessage,
    updateLastMessage,
  } = useChatStore();
  const [stagingAttachments, setStagingAttachments] = useState<Attachment[]>(
    [],
  );
  const router = useRouter();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const params = useParams();

  const routeChatId = params.id as string;

  useEffect(() => {
    const loadChat = async () => {
      if (!routeChatId) return;

      const res = await fetch(
        `/api/chat/${routeChatId}?guestId=${guestId || ""}`,
      );

      if (!res.ok) {
        console.error("Failed load chat");
        return;
      }

      const data = await res.json();

      setChats(data.messages);

      setChatId(routeChatId);
    };

    loadChat();
  }, [routeChatId, guestId, setChats, setChatId]);

  const handleSendMessage = async (
    text: string,
    uploadedFiles: File[],
    isCreateImageMode: boolean,
  ) => {
    if (isCreateImageMode) {
      alert(`Fitur Create Image sedang dibangun! Prompt Anda: ${text}`);
      return;
    }

    let finalPrompt = text;
    for (const att of stagingAttachments) {
      if (att.type === "code") {
        finalPrompt += `\n\n[File: ${att.metadata?.filename || "code"}]\n\`\`\`\n${att.content}\n\`\`\``;
      }
    }

    const userMessage: MessageProps = {
      role: "user",
      content: finalPrompt,
      attachments: [...stagingAttachments],
    };

    const aiMessagePlaceholder: MessageProps = {
      role: "assistant",
      content: "",
    };

    addMessage(userMessage);

    addMessage(aiMessagePlaceholder);
    setStagingAttachments([]);
    setIsTyping(true);

    try {
      const currentMessages = chats.map((c) => ({
        role: c.role,
        content: c.content,
      }));
      currentMessages.push({ role: "user", content: finalPrompt });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          modelId: selectedModel.id,
          chatId,
          guestId,
        }),
      });

      const newChatId = res.headers.get("X-Chat-ID");

      if (newChatId) {
        setChatId(newChatId);
        router.replace(`/${locale}/chat/${newChatId}`);
      }

      if (!res.body) throw new Error("Tidak ada stream response dari server.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let aiTextBuffer = "";
      let displayedText = "";

      const drainInterval = setInterval(() => {
        if (displayedText.length < aiTextBuffer.length) {
          const charsToAdd = aiTextBuffer.slice(
            displayedText.length,
            displayedText.length + 3,
          );
          displayedText += charsToAdd;

          updateLastMessage(displayedText);
        }
      }, 15);
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          aiTextBuffer += chunk;
        }
      }

      const finishInterval = setInterval(() => {
        if (displayedText.length >= aiTextBuffer.length) {
          clearInterval(drainInterval);
          clearInterval(finishInterval);
          setIsTyping(false);
        }
      }, 50);
    } catch (error: unknown) {
      console.error("Gagal mengirim pesan:", error);
      setIsTyping(false);
    }
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
                  content="Draft Lampiran..."
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
