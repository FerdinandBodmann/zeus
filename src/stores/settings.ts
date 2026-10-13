import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { Settings } from '../types'

interface SettingsState {
  settings: Settings
  loading: boolean
  loadSettings: () => Promise<void>
  saveSettings: (settings: Partial<Settings>) => Promise<void>
  getSetting: (key: string) => string | undefined
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
  loading: false,

  loadSettings: async () => {
    set({ loading: true })
    try {
      const settings = await invoke('get_settings')
      set({ settings: settings as Settings, loading: false })
    } catch (error) {
      console.error('Failed to load settings:', error)
      set({ loading: false })
    }
  },

  saveSettings: async (partialSettings) => {
    const current = get().settings
    const updated = { ...current, ...partialSettings }
    
    try {
      await invoke('save_settings', { settings: updated })
      set({ settings: updated })
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  },

  getSetting: (key) => get().settings[key],
}))