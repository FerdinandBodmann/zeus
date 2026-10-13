import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { ApiKey, ApiKeyCreate, ApiKeyUpdate } from '../types'

interface ApiKeyState {
  apiKeys: ApiKey[]
  loading: boolean
  loadApiKeys: () => Promise<void>
  addApiKey: (data: ApiKeyCreate) => Promise<ApiKey>
  updateApiKey: (id: string, data: ApiKeyUpdate) => Promise<void>
  deleteApiKey: (id: string) => Promise<void>
  testApiKey: (id: string) => Promise<boolean>
}

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  apiKeys: [],
  loading: false,

  loadApiKeys: async () => {
    set({ loading: true })
    try {
      const apiKeys = await invoke('list_api_keys')
      set({ apiKeys: apiKeys as ApiKey[], loading: false })
    } catch (error) {
      console.error('Failed to load API keys:', error)
      set({ loading: false })
    }
  },

  addApiKey: async (data) => {
    const apiKey = await invoke('add_api_key', { create: data })
    const newKey = apiKey as ApiKey
    set((state) => ({ apiKeys: [...state.apiKeys, newKey] }))
    return newKey
  },

  updateApiKey: async (id, data) => {
    await invoke('update_api_key', { id, update: data })
    await get().loadApiKeys()
  },

  deleteApiKey: async (id) => {
    await invoke('delete_api_key', { id })
    set((state) => ({ apiKeys: state.apiKeys.filter((k) => k.id !== id) }))
  },

  testApiKey: async (id) => {
    try {
      const result = await invoke('test_api_key', { id })
      return result as boolean
    } catch (error) {
      console.error('Failed to test API key:', error)
      return false
    }
  },
}))