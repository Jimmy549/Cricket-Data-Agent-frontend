'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🏏 Cricket Data Agent
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ask questions about cricket statistics - Test, ODI, and T20 formats
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}