'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send, Loader2, History, Trash2 } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { api } from '@/lib/api'
import { clearAuth, getAuth } from '@/lib/auth'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  format?: 'text' | 'table'
  table?: {
    columns: string[]
    rows: any[][]
  }
  timestamp?: Date
}

interface ConversationHistory {
  id: string
  question: string
  answer: string
  format: string
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId] = useState(() => getAuth()?.user?.id || 'anonymous')
  const [showHistory, setShowHistory] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([])

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem(`cricket-chat-messages-${userId}`)
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages))
        } catch (error) {
          console.error('Error loading saved messages:', error)
        }
      }
    }
  }, [userId])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(`cricket-chat-messages-${userId}`, JSON.stringify(messages))
    }
  }, [messages, userId])

  const loadConversationHistory = useCallback(async () => {
    try {
      const response = await api.get(`/cricket/history?limit=20`)
      if (response.data?.success) {
        setConversationHistory(response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }, [])

  const clearMemory = async () => {
    try {
      await api.post(`/cricket/clear-memory`)
      setMessages([])
      setConversationHistory([])
      // Clear localStorage as well
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`cricket-chat-messages-${userId}`)
      }
    } catch (error) {
      console.error('Error clearing memory:', error)
    }
  }

  useEffect(() => {
    if (showHistory) {
      loadConversationHistory()
    }
  }, [showHistory, loadConversationHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await api.post(`/cricket/ask`, {
        question: input.trim(),
      })

      let assistantMessage: Message;
      
      if (response.data.success) {
        if (response.data.format === 'table' && Array.isArray(response.data.data)) {
          // Convert array of objects to table format
          const columns = Object.keys(response.data.data[0] || {});
          const rows = response.data.data.map((item: any) => columns.map(col => item[col]));
          
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: `Here are the results:`,
            format: 'table',
            table: { columns, rows }
          };
        } else {
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: response.data.data || response.data.message,
            format: 'text'
          };
        }
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.data.message || 'Sorry, I could not process your question.',
          format: 'text'
        };
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, there was an error processing your question. Please try again.',
        format: 'text',
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-slate-900/70 shadow-2xl shadow-emerald-500/15 ring-1 ring-slate-800 backdrop-blur">
      {/* Header with Memory Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-slate-50 sm:text-lg">Cricket Data Agent</h2>
          <p className="mt-0.5 text-xs text-slate-400 sm:text-[13px]">
            Chat, remember, and analyze Test, ODI &amp; T20 stats.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              clearAuth()
              window.location.href = '/login'
            }}
            className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700 sm:inline-flex"
          >
            Logout
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-emerald-400 sm:text-sm"
          >
            <History className="w-4 h-4" />
            <span>{showHistory ? 'Hide' : 'Show'} History</span>
          </button>
          <button
            onClick={clearMemory}
            className="hidden items-center space-x-1 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500 sm:flex"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Memory</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Chat Messages */}
        <div className={`${showHistory ? 'md:w-2/3' : 'w-full'} flex flex-col`}>
          {/* Messages Container */}
          <div className="h-[60vh] space-y-4 overflow-y-auto px-3 pb-4 pt-5 sm:h-[65vh] sm:px-5 sm:pb-5 sm:pt-6 lg:h-[500px]">
            {messages.length === 0 && (
              <div className="mt-10 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-5 text-center text-slate-400">
                <p className="mb-3 text-base font-medium text-slate-100">
                  👋 Welcome! I remember your cricket conversations.
                </p>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="text-slate-400">Try asking:</p>
                  <p className="text-slate-300">&quot;Who has the most runs in Test cricket?&quot;</p>
                  <p className="text-slate-300">&quot;Show top 5 ODI players by average&quot;</p>
                  <p className="text-slate-300">Then: &quot;What about T20 format?&quot;</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-center justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-300" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-slate-800 bg-slate-950/60 px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a cricket question... I remember your context."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:px-4 sm:text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center space-x-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-base"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Conversation History Panel */}
        {showHistory && (
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Conversation History</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent conversations</p>
            </div>
            <div className="h-[500px] overflow-y-auto p-4 space-y-3">
              {conversationHistory.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No conversation history yet.</p>
              ) : (
                conversationHistory.map((conv) => (
                  <div key={conv.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Q: {conv.question.length > 50 ? conv.question.substring(0, 50) + '...' : conv.question}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      A: {conv.answer.length > 80 ? conv.answer.substring(0, 80) + '...' : conv.answer}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(conv.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}