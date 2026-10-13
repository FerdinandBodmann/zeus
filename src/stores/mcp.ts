import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { McpServer, McpServerCreate, McpServerUpdate, McpTool } from '../types'

interface McpState {
  servers: McpServer[]
  tools: Record<string, McpTool[]>
  loading: boolean
  loadMcpServers: () => Promise<void>
  addMcpServer: (data: McpServerCreate) => Promise<McpServer>
  updateMcpServer: (id: string, data: McpServerUpdate) => Promise<void>
  deleteMcpServer: (id: string) => Promise<void>
  connectMcpServer: (id: string) => Promise<void>
  disconnectMcpServer: (id: string) => Promise<void>
  listMcpTools: (id: string) => Promise<McpTool[]>
  callMcpTool: (id: string, toolName: string, args: Record<string, unknown>) => Promise<any>
}

export const useMcpStore = create<McpState>((set, get) => ({
  servers: [],
  tools: {},
  loading: false,

  loadMcpServers: async () => {
    set({ loading: true })
    try {
      const servers = await invoke('list_mcp_servers')
      set({ servers: servers as McpServer[], loading: false })
    } catch (error) {
      console.error('Failed to load MCP servers:', error)
      set({ loading: false })
    }
  },

  addMcpServer: async (data) => {
    const server = await invoke('add_mcp_server', { create: data })
    const newServer = server as McpServer
    set((state) => ({ servers: [...state.servers, newServer] }))
    return newServer
  },

  updateMcpServer: async (id, data) => {
    await invoke('update_mcp_server', { id, update: data })
    await get().loadMcpServers()
  },

  deleteMcpServer: async (id) => {
    await invoke('delete_mcp_server', { id })
    set((state) => ({
      servers: state.servers.filter((s) => s.id !== id),
      tools: Object.fromEntries(
        Object.entries(state.tools).filter(([key]) => key !== id)
      ),
    }))
  },

  connectMcpServer: async (id) => {
    await invoke('connect_mcp_server', { id })
  },

  disconnectMcpServer: async (id) => {
    await invoke('disconnect_mcp_server', { id })
    set((state) => {
      const newTools = { ...state.tools }
      delete newTools[id]
      return { tools: newTools }
    })
  },

  listMcpTools: async (id) => {
    const tools = await invoke('list_mcp_tools', { id })
    const toolList = tools as McpTool[]
    set((state) => ({ tools: { ...state.tools, [id]: toolList } }))
    return toolList
  },

  callMcpTool: async (id, toolName, args) => {
    const result = await invoke('call_mcp_tool', {
      id,
      toolName,
      arguments: args,
    })
    return result
  },
}))