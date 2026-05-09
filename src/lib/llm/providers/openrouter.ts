import type { ChatMessage, LLMMetricResponse } from '@/lib/data/types'
import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLE } from '../prompts'

export async function callOpenRouter(
  messages: ChatMessage[]
): Promise<LLMMetricResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY

  // Runtime guard — catches misconfiguration immediately
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      temperature: 0.2,   // low temp = more deterministic JSON output
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        // Few-shot example before the real conversation
        { role: 'user',      content: FEW_SHOT_EXAMPLE.user      },
        { role: 'assistant', content: FEW_SHOT_EXAMPLE.assistant  },
        // Actual conversation history
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error ${response.status}: ${error}`)
  }

  const json = await response.json()
  const raw = json.choices?.[0]?.message?.content

  if (!raw) throw new Error('Empty response from OpenRouter')

  return parseStructuredResponse(raw)
}

// Safely parses the LLM JSON response
// LLMs sometimes wrap JSON in markdown — this handles that
function parseStructuredResponse(raw: string): LLMMetricResponse {
  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned) as LLMMetricResponse
  } catch {
    // Fallback: if JSON parsing fails, return a safe explanation response
    return {
      intent: 'explanation',
      explanation: cleaned,
    }
  }
}