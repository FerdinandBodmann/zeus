import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { Model } from '../types'

interface ModelState {
  models: Model[]
  loading: boolean
  loadModels: () => Promise<void>
  refreshModels: (providerId: string) => Promise<void>
}

export const useModelStore = create<ModelState>((set, get) => ({
  models: [],
  loading: false,

  loadModels: async () => {
    set({ loading: true })
    try {
      const models = await invoke('list_models')
      set({ models: models as Model[], loading: false })
    } catch (error) {
      console.error('Failed to load models:', error)
      set({ loading: false })
    }
  },

  refreshModels: async (_providerId) => {
    try {
      // In a real implementation, we'd call an API to fetch models from provider
      // For now, just reload
      await get().loadModels()
    } catch (error) {
      console.error('Failed to refresh models:', error)
    }
  },
}))