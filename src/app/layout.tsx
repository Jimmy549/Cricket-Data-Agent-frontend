import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cricket Data Agent',
  description: 'AI-powered cricket statistics assistant for Test, ODI and T20 formats',
  icons: {
    icon: '/cricket-favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-500 shadow-lg shadow-emerald-500/30">
                  <Image
                    src="/logo-cricket.svg"
                    alt="Cricket Data Agent logo"
                    width={22}
                    height={22}
                    priority
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Cricket Data Agent
                  </div>
                  <p className="text-xs text-slate-400">
                    Ask anything about Test, ODI &amp; T20 stats
                  </p>
                </div>
              </div>
              <nav className="hidden items-center space-x-4 text-sm text-slate-300 sm:flex">
                <Link href="/" className="hover:text-white">
                  Chat
                </Link>
                <Link href="/login" className="hover:text-white">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
                >
                  Get started
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-900 bg-slate-950/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-slate-500">
              <span>© {new Date().getFullYear()} Cricket Data Agent</span>
              <span className="hidden sm:inline">Built with Next.js, Nest.js &amp; MongoDB</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}