import { Link, useLocation, Outlet } from 'react-router-dom'
import { useZeus } from '../context/ZeusContext'
import { useConversationStore } from '../stores/conversations'
import { useMcpStore } from '../stores/mcp'
import { useProviderStore } from '../stores/providers'
import { useApiKeyStore } from '../stores/apikeys'
import { 
   
  MessageSquare, 
  Key, 
  Server, 
  Cpu, 
  Plug, 
  Settings, 
  Menu, 
  X, 
  
  
  History,
  Bot
} from 'lucide-react'

export function Layout() {
  const { sidebarOpen, setSidebarOpen } = useZeus()
  const { conversations } = useConversationStore()
  const { providers } = useProviderStore()
  const { apiKeys } = useApiKeyStore()
  const { servers } = useMcpStore()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: MessageSquare, label: 'Chat' },
    { path: '/conversations', icon: History, label: 'Conversations', badge: conversations.length },
    { path: '/api-keys', icon: Key, label: 'API Keys', badge: apiKeys.length },
    { path: '/providers', icon: Server, label: 'Providers', badge: providers.filter(p => p.enabled).length },
    { path: '/models', icon: Cpu, label: 'Models' },
    { path: '/mcp', icon: Plug, label: 'MCP', badge: servers.filter(s => s.enabled).length },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-dark-bg border-r border-dark-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zeus-500 to-zeus-700 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">zeus</h1>
              <p className="text-xs text-dark-muted">AI Agents on Arch</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-dark-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-colors
                  ${isActive 
                    ? 'sidebar-item-active' 
                    : 'sidebar-item'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-zeus-500/20 text-zeus-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-dark-border">
          <div className="text-xs text-dark-muted px-3 py-2">
            <div className="flex items-center justify-between">
              <span>Providers</span>
              <span className="text-zeus-400">{providers.filter(p => p.enabled).length} active</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>MCP Servers</span>
              <span className="text-zeus-400">{servers.filter(s => s.enabled).length} active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="lg:hidden flex items-center p-3 border-b border-dark-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-dark-border"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zeus-500 to-zeus-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">zeus</span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}