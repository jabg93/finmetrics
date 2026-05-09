import type { ChatMessage, LLMMetricResponse } from '@/lib/data/types'
import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLE } from '../prompts'

export async function callAnthropic(
  messages: ChatMessage[]
): Promise<LLMMetricResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,                  // Anthropic uses x-api-key, not Bearer
      'anthropic-version': '2023-06-01',    // required header
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',   // fastest + cheapest Anthropic model
      max_tokens: 1024,
      system: SYSTEM_PROMPT,                // Anthropic separates system from messages
      messages: [
        { role: 'user',      content: FEW_SHOT_EXAMPLE.user      },
        { role: 'assistant', content: FEW_SHOT_EXAMPLE.assistant  },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic error ${response.status}: ${error}`)
  }

  const json = await response.json()
  const raw = json.content?.[0]?.text

  if (!raw) throw new Error('Empty response from Anthropic')

  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()

  try {
    return JSON.parse(cleaned) as LLMMetricResponse
  } catch {
    return { intent: 'explanation', explanation: cleaned }
  }
}