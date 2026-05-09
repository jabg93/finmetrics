// src/lib/llm/fabric.ts
import type { ChatMessage, LLMMetricResponse, LLMProviderType } from '@/lib/data/types'
import { callOpenRouter } from './providers/openrouter'
import { callOpenAI }     from './providers/openai'
import { callAnthropic }  from './providers/anthropic'
import { callGemini }  from './providers/gemini'

// Reads which provider to use from environment variables
function getActiveProvider(): LLMProviderType {
  const provider = process.env.LLM_PROVIDER as LLMProviderType
  const valid: LLMProviderType[] = ['openrouter', 'openai', 'anthropic', 'gemini']

  if (!valid.includes(provider)) {
    console.warn(`Invalid LLM_PROVIDER "${provider}", falling back to openrouter`)
    return 'openrouter'
  }

  return provider
}

// Single entry point for the entire app
export async function chat(
  messages: ChatMessage[]
): Promise<LLMMetricResponse> {
  const provider = getActiveProvider()

  switch (provider) {
    case 'openrouter': return callOpenRouter(messages)
    case 'openai':     return callOpenAI(messages)
    case 'anthropic':  return callAnthropic(messages)
    case 'gemini':  return callGemini(messages)
  }
}

// Exposes the active provider name for UI display (the badge in the header)
export function getProviderInfo(): { provider: LLMProviderType; model: string } {
  const provider = getActiveProvider()

  const models: Record<LLMProviderType, string> = {
    openrouter: 'mistral-7b-instruct',
    openai:     'gpt-4o-mini',
    anthropic:  'claude-haiku',
    gemini:  'gemini-1.5-flash',
  }

  return { provider, model: models[provider] }
}