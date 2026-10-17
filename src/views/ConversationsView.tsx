import { useEffect } from 'react'
import { useConversationStore } from '../stores/conversations'
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function ConversationsView() {
  const { conversations, loadConversations, createConversation, deleteConversation, setCurrentConversation, clearMessages } = useConversationStore()

  useEffect(() => {
    loadConversations()
  }, [])

  const handleNewConversation = async () => {
    const conv = await createConversation({
      title: 'New Conversation',
      modelId: undefined,
    })
    setCurrentConversation(conv)
    clearMessages()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <button onClick={handleNewConversation} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="text-center py-12 text-dark-muted">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} className="card flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{conv.title}</h3>
                <p className="text-sm text-dark-muted flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => deleteConversation(conv.id)}
                className="btn-ghost p-2 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}