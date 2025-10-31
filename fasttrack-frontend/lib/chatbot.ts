const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://127.0.0.1:8080'

export type ChatbotResponse = {
  answer: string
  sources: Array<{ source?: string; relevance_score?: number; chunk_index?: number }>
  context_used: number
  session_id?: string
}

export async function askChatbot(query: string, sessionId: string = 'web-session', topK: number = 5): Promise<ChatbotResponse> {
  const res = await fetch(`${CHATBOT_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, session_id: sessionId, stream: false, top_k: topK })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any))
    throw new Error(err.detail || `Chatbot error: ${res.status}`)
  }

  return res.json()
}


