import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useSettingsStore } from '../stores/settings'
import { useConversationStore } from '../stores/conversations'
import { useMcpStore } from '../stores/mcp'
import { useProviderStore } from '../stores/providers'
import { useApiKeyStore } from '../stores/apikeys'

interface ZeusContextType {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  systemInfo: any
}

const ZeusContext = createContext<ZeusContextType | null>(null)

export function useZeus() {
  const context = useContext(ZeusContext)
  if (!context) {
    throw new Error('useZeus must be used within a ZeusProvider')
  }
  return context
}

interface ZeusProviderProps {
  children: ReactNode
}

export function ZeusProvider({ children }: ZeusProviderProps) {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [systemInfo, setSystemInfo] = useState<any>(null)

  const { settings, loadSettings } = useSettingsStore()
  const { loadConversations } = useConversationStore()
  const { loadMcpServers } = useMcpStore()
  const { loadProviders } = useProviderStore()
  const { loadApiKeys } = useApiKeyStore()

  useEffect(() => {
    loadSettings()
    loadConversations()
    loadMcpServers()
    loadProviders()
    loadApiKeys()
    loadSystemInfo()
  }, [])

  useEffect(() => {
    if (settings.theme) {
      setThemeState(settings.theme)
    }
  }, [settings.theme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme)
  }

  const loadSystemInfo = async () => {
    try {
      const info = await invoke('get_system_info')
      setSystemInfo(info)
    } catch (error) {
      console.error('Failed to load system info:', error)
    }
  }

  return (
    <ZeusContext.Provider value={{ theme, sidebarOpen, setSidebarOpen, setTheme, systemInfo }}>
      {children}
    </ZeusContext.Provider>
  )
}