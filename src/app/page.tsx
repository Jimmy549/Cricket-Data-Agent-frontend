'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'
import { getAuth } from '@/lib/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    if (!auth?.accessToken) {
      router.push('/login')
    }
  }, [router])

  return (
    <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-6xl flex-col px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
        <section className="mb-4 text-left sm:mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Ask intelligent questions about cricket stats
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-400 sm:text-base">
            Chat with an AI agent that understands Test, ODI and T20 player records, remembers your conversations
            and answers in clean text or tables.
          </p>
        </section>

        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}