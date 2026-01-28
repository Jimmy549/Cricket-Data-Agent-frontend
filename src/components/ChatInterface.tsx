'use client'

import { useState } from 'react'
import axios from 'axios'
import { Send, Loader2 } from 'lucide-react'
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
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
      const response = await axios.post(`${API_URL}/cricket/ask`, {
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
      {/* Messages Container */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <p className="text-lg mb-4">👋 Welcome! Ask me anything about cricket statistics.</p>
            <div className="text-sm space-y-1">
              <p>Try asking:</p>
              <p className="text-gray-400">"Who has the most runs in Test cricket?"</p>
              <p className="text-gray-400">"Show top 5 ODI players by average"</p>
              <p className="text-gray-400">"List T20 players with strike rate above 140"</p>
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
            placeholder="Ask a cricket statistics question..."
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
  )
}