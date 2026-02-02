'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Send, Loader2, History, Trash2 } from 'lucide-react'
import MessageBubble from './MessageBubble'

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
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [showHistory, setShowHistory] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const loadConversationHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/cricket/history/${userId}?limit=20`)
      if (response.data.success) {
        setConversationHistory(response.data.data)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const clearMemory = async () => {
    try {
      await axios.post(`${API_URL}/cricket/clear-memory/${userId}`)
      setMessages([])
      setConversationHistory([])
    } catch (error) {
      console.error('Error clearing memory:', error)
    }
  }

  useEffect(() => {
    if (showHistory) {
      loadConversationHistory()
    }
  }, [showHistory])

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
      const response = await axios.post(`${API_URL}/cricket/ask?userId=${userId}`, {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Header with Memory Controls */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cricket Data Agent</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center space-x-1"
          >
            <History className="w-4 h-4" />
            <span>{showHistory ? 'Hide' : 'Show'} History</span>
          </button>
          <button
            onClick={clearMemory}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Memory</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Chat Messages */}
        <div className={`${showHistory ? 'w-2/3' : 'w-full'} flex flex-col`}>
          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                <p className="text-lg mb-4">👋 Welcome! I remember our conversations now!</p>
                <div className="text-sm space-y-1">
                  <p>Try asking:</p>
                  <p className="text-gray-400">"Who has the most runs in Test cricket?"</p>
                  <p className="text-gray-400">"Show top 5 ODI players by average"</p>
                  <p className="text-gray-400">Then: "What about T20 format?"</p>
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
          <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a cricket question... I'll remember our conversation!"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
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