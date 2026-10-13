import { useState, useEffect } from 'react'
import { useConversationStore } from '../stores/conversations'
import { useProviderStore } from '../stores/providers'
import { useModelStore } from '../stores/models'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import {  } from 'date-fns'

export function ChatView() {
  const [message, setMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const { createConversation, sendMessage, messages, currentConversation, loadMessages } = useConversationStore()
  const { providers } = useProviderStore()
  const { models, loadModels } = useModelStore()

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id)
    }
  }, [currentConversation, loadMessages])

  useEffect(() => {
    if (providers.length > 0) {
      loadModels()
    }
  }, [providers, loadModels])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    if (!selectedModel) {
      alert('Please select a model')
      return
    }

    let conversation = currentConversation
    if (!conversation) {
      conversation = await createConversation({
        title: message.slice(0, 50),
        modelId: selectedModel,
      })
    }

    await sendMessage(conversation.id, message, selectedModel)
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        {!currentConversation ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center max-w-2xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-zeus-500 to-zeus-700 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Zeus</h1>
              <p className="text-dark-muted mb-6">AI agents on Arch Linux. Start a conversation below.</p>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                {[
                  "What is Zeus?",
                  "How can I use MCP with Zeus?",
                  "Explain the benefits of local AI",
                  "Show me how to add API keys"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setMessage(suggestion)}
                    className="p-4 text-left bg-dark-card border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-zeus-500' 
                      : 'bg-dark-card border border-dark-border'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-zeus-600 text-white'
                      : 'bg-dark-card border border-dark-border'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-dark-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="input w-64"
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.displayName}
                </option>
              ))}
            </select>
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="input pr-12 resize-none"
                rows={1}
                style={{ height: 'auto', minHeight: '44px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !selectedModel}
                className="btn-primary absolute right-2 top-1.5 p-1.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}