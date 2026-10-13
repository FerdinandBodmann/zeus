import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { Provider, ProviderCreate, ProviderUpdate } from '../types'

interface ProviderState {
  providers: Provider[]
  loading: boolean
  loadProviders: () => Promise<void>
  addProvider: (data: ProviderCreate) => Promise<Provider>
  updateProvider: (id: string, data: ProviderUpdate) => Promise<void>
  deleteProvider: (id: string) => Promise<void>
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: [],
  loading: false,

  loadProviders: async () => {
    set({ loading: true })
    try {
      const providers = await invoke('list_providers')
      set({ providers: providers as Provider[], loading: false })
    } catch (error) {
      console.error('Failed to load providers:', error)
      set({ loading: false })
    }
  },

  addProvider: async (data) => {
    const provider = await invoke('add_provider', { create: data })
    const newProvider = provider as Provider
    set((state) => ({ providers: [...state.providers, newProvider] }))
    return newProvider
  },

  updateProvider: async (id, data) => {
    await invoke('update_provider', { id, update: data })
    await get().loadProviders()
  },

  deleteProvider: async (id) => {
    await invoke('delete_provider', { id })
    set((state) => ({ providers: state.providers.filter((p) => p.id !== id) }))
  },
}))