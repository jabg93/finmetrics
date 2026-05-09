import { NextRequest, NextResponse } from 'next/server'
import { chat, getProviderInfo } from '@/lib/llm/fabric'
import { compareKPI, getKPI, getTimeSeries } from '@/lib/data/financial-mock'
import type { ChatMessage, LLMMetricResponse } from '@/lib/data/types'


const requestLog = new Map<string, number[]>()
const RATE_LIMIT = 20
const RATE_WINDOW = 60000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = requestLog.get(ip) ?? []

  const recent = timestamps.filter((t) => now - t < RATE_WINDOW)

  if (recent.length >= RATE_LIMIT) return true

  requestLog.set(ip, [...recent, now])
  return false
}

// ─── Input validation ──────────────────────────────────────────────────────
function validateMessages(messages: unknown): messages is ChatMessage[] {
  if (!Array.isArray(messages)) return false
  if (messages.length === 0) return false
  if (messages.length > 50) return false

  return messages.every(
    (m) =>
      typeof m === 'object' &&
      m !== null &&
      typeof (m as ChatMessage).role === 'string' &&
      typeof (m as ChatMessage).content === 'string' &&
      (m as ChatMessage).content.length <= 2000
  )
}

// ─── Data enrichment ──────────────────────────────────────────────────────
// After the LLM responds with structured JSON,
function enrichResponse(llmResponse: LLMMetricResponse): LLMMetricResponse {
  // If LLM returned data, use it directly
  if (llmResponse.data && llmResponse.data.length > 0) return llmResponse

  // Otherwise hydrate data from our data layer
  if (llmResponse.metric) {
    // Comparison across periods
    if (llmResponse.periods && llmResponse.periods.length > 0) {
      const data = compareKPI(llmResponse.metric, llmResponse.periods)
      if (data.length > 0) return { ...llmResponse, data }
    }

    // Single metric — wrap as single data point
    const kpi = getKPI(llmResponse.metric)
    if (kpi) {
      return {
        ...llmResponse,
        data: [{ period: `${kpi.period} ${kpi.year}`, value: kpi.value }],
      }
    }

    // Time series fallback (revenue, ebitda, sharpe)
    const seriesIds = ['revenue', 'ebitda', 'sharpe'] as const
    const matchedSeries = seriesIds.find((id) => llmResponse.metric?.includes(id))
    if (matchedSeries) {
      const series = getTimeSeries(matchedSeries)
      return { ...llmResponse, data: series.data }
    }
  }

  return llmResponse
}

// ─── POST /api/chat ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    // 2. Parse body
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // 3. Validate messages
    const { messages } = body
    if (!validateMessages(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // 4. Call the LLM Fabric
    const llmResponse = await chat(messages)

    // 5. Enrich with real data
    const enriched = enrichResponse(llmResponse)

    // 6. Return enriched response + provider info
    const providerInfo = getProviderInfo()

    return NextResponse.json({
      ...enriched,
      provider: providerInfo.provider,
      model: providerInfo.model,
    })

  } catch (error) {
    console.error('[/api/chat] Error:', error)

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// ─── GET /api/chat — health check ─────────────────────────────────────────
export async function GET() {
  const { provider, model } = getProviderInfo()

  return NextResponse.json({
    status: 'ok',
    provider,
    model,
  })
}