import { AI_PROVIDERS, AIModel } from "@/constants/model";
import { create } from "zustand";

interface ChatStore {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedModel: AI_PROVIDERS[1].models[1],
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
