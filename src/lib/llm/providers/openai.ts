import type { ChatMessage, LLMMetricResponse } from '@/lib/data/types'
import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLE } from '../prompts'

export async function callOpenAI(
  messages: ChatMessage[]
): Promise<LLMMetricResponse> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' }, // OpenAI native JSON mode
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
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
    throw new Error(`OpenAI error ${response.status}: ${error}`)
  }

  const json = await response.json()
  const raw = json.choices?.[0]?.message?.content

  if (!raw) throw new Error('Empty response from OpenAI')

  try {
    return JSON.parse(raw) as LLMMetricResponse
  } catch {
    return { intent: 'explanation', explanation: raw }
  }
}