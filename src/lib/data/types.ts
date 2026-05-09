// ─── Time periods ─────────────────────────────────────────────────────────
export type Period = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'YTD' | 'TTM'
export type Year = 2022 | 2023 | 2024 | 2025

// ─── Financial sectors ────────────────────────────────────────────────────
export type Sector =
  | 'Technology'
  | 'Financials'
  | 'Energy'
  | 'Healthcare'
  | 'Consumer'
  | 'Industrials'

// ─── Single KPI ───────────────────────────────────────────────────────────
export interface KPI {
  id: string   // unique identifier: 'aum_total'
  label: string  // display name: 'Total AUM'
  value: number  // raw numeric value: 24800000000
  formatted: string  // display value: '$24.8B'
  delta: number  // percentage change vs prior period: 8.4
  deltaLabel: string // change label: '+8.4% YTD'
  trend: 'up' | 'down' | 'neutral'
  unit: 'usd' | 'percentage' | 'ratio' | 'number'
  period: Period
  year: Year
}

// ─── Time series (for charts) ─────────────────────────────────────────────
export interface TimeSeriesPoint {
  period: string // 'Q1 2023'
  value: number
}

export interface TimeSeries {
  id: string
  label: string
  unit: 'usd' | 'percentage' | 'ratio'
  data: TimeSeriesPoint[]
}

// ─── Portfolio holding / position ─────────────────────────────────────────
export interface Holding {
  ticker: string // 'AAPL'
  name: string // 'Apple Inc.'
  sector: Sector
  weight: number // portfolio percentage: 8.4
  metrics: {
  pe: number // Price/Earnings ratio
  roe: number  // Return on Equity %
  debtToEquity: number
  returnOneMonth: number
  returnYTD: number
  }
}

// ─── Asset class allocation ───────────────────────────────────────────────
export interface AssetAllocation {
  label: string  // 'Fixed Income'
  percentage: number // 30
  valueUSD: number   // dollar value
}

// ─── Full portfolio snapshot ──────────────────────────────────────────────
export interface PortfolioSnapshot {
  asOf: string // '2024-Q4'
  kpis: KPI[]
  holdings: Holding[]
  allocation: AssetAllocation[]
  timeSeries: {
  revenue: TimeSeries
  ebitda: TimeSeries
  sharpe: TimeSeries
  }
}

// ─── Chat types ───────────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: Date
  metadata?: {
  metric?: string // generated metric if applicable
  chartType?: string  // suggested chart type
  provider?: string   // which LLM responded
  }
}

// ─── LLM structured response ──────────────────────────────────────────────
// This is what the LLM returns — not free text, structured JSON
export interface LLMMetricResponse {
  intent: 'metric' | 'chart' | 'comparison' | 'explanation'
  metric?: string  // 'roe' | 'ebitda' | 'sharpe' ...
  periods?: Period[] // ['Q3', 'Q4']
  chartType?: 'bar' | 'line' | 'pie' | 'area'
  explanation: string  // human-readable insight
  data?: TimeSeriesPoint[] // pre-filtered data for the chart
}

// ─── LLM providers ────────────────────────────────────────────────────────
export type LLMProviderType = 'openrouter' | 'openai' | 'anthropic' | 'gemini'

export interface LLMConfig {
  provider: LLMProviderType
  model: string
  apiKey: string
  baseURL: string
}