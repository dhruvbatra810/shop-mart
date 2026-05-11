import { create } from 'zustand'

export type ChatProduct = {
  id: string
  name: string
  description: string
  price: string | number
  imageUrl: string
  stock: number
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: ChatProduct[]
  isStreaming?: boolean
}

type ChatStore = {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
  addUserMessage: (content: string) => void
  startAssistantMessage: () => string
  appendToMessage: (id: string, chunk: string) => void
  setMessageProducts: (id: string, products: ChatProduct[]) => void
  finalizeMessage: (id: string) => void
  setIsOpen: (open: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Date.now().toString(), role: 'user', content },
      ],
      isLoading: true,
    })),

  startAssistantMessage: () => {
    const id = (Date.now() + 1).toString()
    set((state) => ({
      messages: [
        ...state.messages,
        { id, role: 'assistant', content: '', isStreaming: true },
      ],
    }))
    return id
  },

  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m
      ),
    })),

  setMessageProducts: (id, products) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, products } : m
      ),
    })),

  finalizeMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false } : m
      ),
      isLoading: false,
    })),

  setIsOpen: (open) => set({ isOpen: open }),

  clearMessages: () => set({ messages: [], isLoading: false }),
}))
