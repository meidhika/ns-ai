import { AI_PROVIDERS, AIModel } from "@/constants/model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MessageProps } from "@/components/chat/ChatMessage";

interface ChatStore {
  selectedModel: AIModel;

  guestId: string | null;

  chatId: string | null;

  chats: MessageProps[];

  setSelectedModel: (model: AIModel) => void;

  setChatId: (chatId: string | null) => void;

  setChats: (messages: MessageProps[]) => void;

  addMessage: (message: MessageProps) => void;

  updateLastMessage: (content: string) => void;

  clearChats: () => void;

  initGuestId: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      selectedModel: AI_PROVIDERS[1].models[0],

      guestId: null,

      chatId: null,

      chats: [],

      setSelectedModel: (model) => set({ selectedModel: model }),

      setChatId: (chatId) => set({ chatId }),

      setChats: (messages) => set({ chats: messages }),

      addMessage: (message) =>
        set((state) => ({
          chats: [...state.chats, message],
        })),

      updateLastMessage: (content) =>
        set((state) => {
          const updated = [...state.chats];

          const lastIndex = updated.length - 1;

          updated[lastIndex] = {
            ...updated[lastIndex],
            content,
          };

          return {
            chats: updated,
          };
        }),

      clearChats: () =>
        set({
          chats: [],
          chatId: null,
        }),

      initGuestId: () => {
        if (!get().guestId) {
          set({
            guestId: crypto.randomUUID(),
          });
        }
      },
    }),
    {
      name: "ns-chat-storage",

      partialize: (state) => ({
        guestId: state.guestId,
        chatId: state.chatId,
      }),
    },
  ),
);
