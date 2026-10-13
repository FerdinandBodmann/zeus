
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ZeusProvider } from './context/ZeusContext'
import { Layout } from './components/Layout'
import { ChatView } from './views/ChatView'
import { SettingsView } from './views/SettingsView'
import { ApiKeysView } from './views/ApiKeysView'
import { ProvidersView } from './views/ProvidersView'
import { ModelsView } from './views/ModelsView'
import { McpView } from './views/McpView'
import { ConversationsView } from './views/ConversationsView'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ZeusProvider>
        <BrowserRouter>
          <div className="h-full flex flex-col">
            <Toaster position="top-right" toastOptions={{ className: 'bg-dark-card border-dark-border text-dark-text' }} />
            <Routes>
              <Route path="/" element={<Layout><ChatView /></Layout>}>
                <Route index element={<ChatView />} />
                <Route path="conversations" element={<ConversationsView />} />
                <Route path="api-keys" element={<ApiKeysView />} />
                <Route path="providers" element={<ProvidersView />} />
                <Route path="models" element={<ModelsView />} />
                <Route path="mcp" element={<McpView />} />
                <Route path="settings" element={<SettingsView />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </ZeusProvider>
    </QueryClientProvider>
  )
}

export default App