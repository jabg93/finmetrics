import type { ChatMessage, LLMMetricResponse } from '@/lib/data/types'
import { SYSTEM_PROMPT, FEW_SHOT_EXAMPLE } from '../prompts'

// Gemini uses a different message format than OpenAI-compatible APIs

function mapRole(role: ChatMessage['role']): 'user' | 'model' {
  if (role === 'assistant') return 'model'
  if (role === 'system') return 'user' // Gemini handles system via systemInstruction
  return 'user'
}

export async function callGemini(
  messages: ChatMessage[]
): Promise<LLMMetricResponse> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const model = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash'

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Gemini separates system instruction from conversation history
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        // Few-shot example
        {
          role: 'user',
          parts: [{ text: FEW_SHOT_EXAMPLE.user }],
        },
        {
          role: 'model',
          parts: [{ text: FEW_SHOT_EXAMPLE.assistant }],
        },
        // Actual conversation — filter out system messages (already in systemInstruction)
        ...messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({
            role: mapRole(m.role),
            parts: [{ text: m.content }],
          })),
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json', 
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini error ${response.status}: ${error}`)
  }

  const json = await response.json()
  const raw = json.candidates?.[0]?.content?.parts?.[0]?.text

  if (!raw) throw new Error('Empty response from Gemini')

  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()

  try {
    return JSON.parse(cleaned) as LLMMetricResponse
  } catch {
    return { intent: 'explanation', explanation: cleaned }
  }
}