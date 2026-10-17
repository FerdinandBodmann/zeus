import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { Conversation, Message, ConversationCreate } from '../types'

interface ConversationState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  loadConversations: () => Promise<void>
  loadConversation: (id: string) => Promise<void>
  createConversation: (data: ConversationCreate) => Promise<Conversation>
  updateConversation: (id: string, data: Partial<Conversation>) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => Promise<void>
  sendMessage: (conversationId: string, content: string, modelId: string, temperature?: number, maxTokens?: number) => Promise<void>
  clearMessages: () => void
  loadMessages: (id: string) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,

  loadConversations: async () => {
    set({ loading: true })
    try {
      const conversations = await invoke('get_conversations')
      set({ conversations: conversations as Conversation[], loading: false })
    } catch (error) {
      console.error('Failed to load conversations:', error)
      set({ loading: false })
    }
  },

  loadConversation: async (id) => {
    set({ loading: true })
    try {
      const conversation = await invoke('get_conversation', { id })
      set({ currentConversation: conversation as Conversation, loading: false })
    } catch (error) {
      console.error('Failed to load conversation:', error)
      set({ loading: false })
    }
  },

  createConversation: async (data) => {
    const conversation = await invoke('create_conversation', {
      create: data,
    })
    const newConv = conversation as Conversation
    set((state) => ({ conversations: [newConv, ...state.conversations] }))
    return newConv
  },

  updateConversation: async (id, data) => {
    await invoke('update_conversation', { id, update: data })
    const updated = await invoke('get_conversation', { id })
    const newConv = updated as Conversation
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? newConv : c)),
      currentConversation: newConv,
    }))
  },

  deleteConversation: async (id) => {
    await invoke('delete_conversation', { id })
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    }))
  },

  addMessage: async (messageData) => {
    const id = crypto.randomUUID()
    const message: Message = {
      ...messageData,
      id,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ messages: [...state.messages, message] }))
  },

  sendMessage: async (conversationId, content, modelId, temperature, maxTokens) => {
    await get().addMessage({
      conversationId,
      role: 'user',
      content,
    })

    try {
      const response = await invoke('send_message', {
        conversationId,
        content,
        modelId,
        temperature,
        maxTokens,
      })

      const chatResponse = response as any
      const assistantContent = chatResponse.choices?.[0]?.message?.content || ''

      await get().addMessage({
        conversationId,
        role: 'assistant',
        content: assistantContent,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  },

  clearMessages: () => set({ messages: [], currentConversation: null }),

  loadMessages: async (id: string) => {
    set({ loading: true })
    try {
      const msgs = await invoke('get_messages', { conversationId: id })
      set({ messages: msgs as Message[], loading: false })
    } catch (error) {
      console.error('Failed to load messages:', error)
      set({ loading: false })
    }
  },

  setCurrentConversation: (conversation: Conversation | null) => set({ currentConversation: conversation }),
}))
