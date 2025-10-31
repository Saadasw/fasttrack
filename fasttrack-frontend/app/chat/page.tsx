'use client'

import { useEffect, useMemo, useState } from 'react'
import { askChatbot } from '@/lib/chatbot'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hello! I'm the Fast Track AI assistant. How can I help you today?\nYou can ask me about shipping rates, tracking, service areas, pickup scheduling, and more." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ total_documents?: number; index_size?: number } | null>(null)
  const sessionId = useMemo(() => 'web-session', [])
  const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://127.0.0.1:8080'

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user' as const, content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setError(null)
    setLoading(true)
    try {
      const res = await askChatbot(userMsg.content, sessionId)
      const assistantMsg = { role: 'assistant' as const, content: res.answer || 'No answer.' }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e: any) {
      setError(e?.message || 'Chatbot request failed')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${CHATBOT_URL}/api/stats`)
      if (res.ok) {
        const data = await res.json()
        setStats({ total_documents: data.total_documents, index_size: data.index_size })
      }
    } catch {}
  }

  const clearChat = async () => {
    try {
      await fetch(`${CHATBOT_URL}/api/clear-history/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
      setMessages(messages.slice(0, 1))
    } catch {}
  }

  const indexKB = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${CHATBOT_URL}/api/index-kb`, { method: 'POST' })
      if (!res.ok) throw new Error('Indexing failed')
      await fetchStats()
    } catch (e: any) {
      setError(e?.message || 'Failed to index KB')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Fast Track</h1>
            <p className="text-sm text-muted-foreground -mt-1">Communication & Support</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={clearChat}>Clear Chat</Button>
            <Button variant="outline" onClick={fetchStats}>Stats</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 border rounded-lg p-4 bg-card shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Knowledge Base</h3>
                <div className="flex gap-2">
                  <Button onClick={indexKB} disabled={loading}>Index KB Folder</Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Common Questions</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'What are your shipping rates?',
                    'How do I track my package?',
                    'What areas do you deliver to?',
                    'How do I schedule a pickup?'
                  ].map((q) => (
                    <Button key={q} variant="outline" className="text-sm px-3 py-1 h-8 rounded-full" onClick={() => setInput(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">System Stats</h4>
                <div className="text-sm grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Documents</div>
                  <div className="text-right">{stats?.total_documents ?? '-'}</div>
                  <div className="text-muted-foreground">Index Size</div>
                  <div className="text-right">{stats?.index_size ?? '-'}</div>
                </div>
              </div>
              {error && <div className="text-sm text-destructive">{error}</div>}
            </div>
          </aside>

          {/* Chat Section */}
          <section className="md:col-span-8 lg:col-span-9">
            <div className="border rounded-lg bg-card shadow-sm min-h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={
                      'inline-block rounded-lg px-3 py-2 max-w-[90%] whitespace-pre-line ' +
                      (m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')
                    }>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-sm text-muted-foreground">Processing…</div>
                )}
              </div>
              <div className="border-t p-3 flex gap-2">
                <textarea
                  className="flex-1 border rounded-md px-3 py-2 h-[44px] resize-none"
                  placeholder="Type your question here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={2}
                  disabled={loading}
                />
                <Button onClick={send} disabled={loading || !input.trim()}>Send</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


