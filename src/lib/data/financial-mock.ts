import type {
  PortfolioSnapshot,
  KPI,
  Holding,
  AssetAllocation,
  TimeSeries,
  TimeSeriesPoint,
} from './types'

// ─── KPIs ─────────────────────────────────────────────────────────────────
const kpis: KPI[] = [
  {
    id: 'aum_total',
    label: 'Total AUM',
    value: 24800000000,
    formatted: '$24.8B',
    delta: 8.4,
    deltaLabel: '+8.4% YTD',
    trend: 'up',
    unit: 'usd',
    period: 'YTD',
    year: 2024,
  },
  {
    id: 'sharpe_ratio',
    label: 'Sharpe Ratio',
    value: 1.84,
    formatted: '1.84',
    delta: 6.9,
    deltaLabel: '+0.12 vs Q3',
    trend: 'up',
    unit: 'ratio',
    period: 'Q4',
    year: 2024,
  },
  {
    id: 'var_95',
    label: 'VaR (95%)',
    value: 142000000,
    formatted: '$142M',
    delta: -11.2,
    deltaLabel: '-$18M MoM',
    trend: 'up',       // lower VaR is better, so trend up = good
    unit: 'usd',
    period: 'Q4',
    year: 2024,
  },
  {
    id: 'alpha',
    label: 'Alpha',
    value: 3.2,
    formatted: '3.2%',
    delta: -0.4,
    deltaLabel: '-0.4% vs benchmark',
    trend: 'down',
    unit: 'percentage',
    period: 'YTD',
    year: 2024,
  },
  {
    id: 'roe',
    label: 'Return on Equity',
    value: 52.2,
    formatted: '52.2%',
    delta: 7.7,
    deltaLabel: '+7.7pp vs Q3',
    trend: 'up',
    unit: 'percentage',
    period: 'Q4',
    year: 2024,
  },
  {
    id: 'ebitda_margin',
    label: 'EBITDA Margin',
    value: 29.7,
    formatted: '29.7%',
    delta: 2.1,
    deltaLabel: '+2.1pp vs Q3',
    trend: 'up',
    unit: 'percentage',
    period: 'Q4',
    year: 2024,
  },
  {
    id: 'debt_to_equity',
    label: 'Debt / Equity',
    value: 0.43,
    formatted: '0.43x',
    delta: -11.2,
    deltaLabel: '-0.06x vs Q3',
    trend: 'up',       // lower D/E is better
    unit: 'ratio',
    period: 'Q4',
    year: 2024,
  },
]

// ─── Holdings ─────────────────────────────────────────────────────────────
const holdings: Holding[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    weight: 8.4,
    metrics: {
      pe: 28.4,
      roe: 156.0,
      debtToEquity: 1.76,
      returnOneMonth: 3.2,
      returnYTD: 12.3,
    },
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    weight: 7.9,
    metrics: {
      pe: 35.1,
      roe: 43.0,
      debtToEquity: 0.35,
      returnOneMonth: 2.8,
      returnYTD: 18.7,
    },
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase',
    sector: 'Financials',
    weight: 5.1,
    metrics: {
      pe: 11.2,
      roe: 15.0,
      debtToEquity: 1.23,
      returnOneMonth: 1.4,
      returnYTD: 6.2,
    },
  },
  {
    ticker: 'XOM',
    name: 'ExxonMobil Corp.',
    sector: 'Energy',
    weight: 4.7,
    metrics: {
      pe: 14.3,
      roe: 28.0,
      debtToEquity: 0.20,
      returnOneMonth: -1.8,
      returnYTD: -2.1,
    },
  },
  {
    ticker: 'BRK',
    name: 'Berkshire Hathaway',
    sector: 'Financials',
    weight: 4.2,
    metrics: {
      pe: 22.0,
      roe: 19.0,
      debtToEquity: 0.28,
      returnOneMonth: 1.9,
      returnYTD: 9.8,
    },
  },
  {
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    weight: 3.8,
    metrics: {
      pe: 16.4,
      roe: 31.0,
      debtToEquity: 0.44,
      returnOneMonth: 0.6,
      returnYTD: 4.1,
    },
  },
]

// ─── Asset allocation ──────────────────────────────────────────────────────
const allocation: AssetAllocation[] = [
  { label: 'Equities',      percentage: 45, valueUSD: 11160000000 },
  { label: 'Fixed Income',  percentage: 30, valueUSD: 7440000000  },
  { label: 'Commodities',   percentage: 15, valueUSD: 3720000000  },
  { label: 'Cash',          percentage: 10, valueUSD: 2480000000  },
]

// ─── Time series ───────────────────────────────────────────────────────────
const revenueSeries: TimeSeries = {
  id: 'revenue',
  label: 'Revenue',
  unit: 'usd',
  data: [
    { period: 'Q1 2023', value: 4.2 },
    { period: 'Q2 2023', value: 4.8 },
    { period: 'Q3 2023', value: 5.1 },
    { period: 'Q4 2023', value: 5.9 },
    { period: 'Q1 2024', value: 5.4 },
    { period: 'Q2 2024', value: 6.1 },
    { period: 'Q3 2024', value: 6.8 },
    { period: 'Q4 2024', value: 7.4 },
  ],
}

const ebitdaSeries: TimeSeries = {
  id: 'ebitda',
  label: 'EBITDA',
  unit: 'usd',
  data: [
    { period: 'Q1 2023', value: 1.1 },
    { period: 'Q2 2023', value: 1.3 },
    { period: 'Q3 2023', value: 1.4 },
    { period: 'Q4 2023', value: 1.7 },
    { period: 'Q1 2024', value: 1.5 },
    { period: 'Q2 2024', value: 1.8 },
    { period: 'Q3 2024', value: 2.0 },
    { period: 'Q4 2024', value: 2.2 },
  ],
}

const sharpeSeries: TimeSeries = {
  id: 'sharpe',
  label: 'Sharpe Ratio',
  unit: 'ratio',
  data: [
    { period: 'Q1 2023', value: 1.42 },
    { period: 'Q2 2023', value: 1.55 },
    { period: 'Q3 2023', value: 1.61 },
    { period: 'Q4 2023', value: 1.72 },
    { period: 'Q1 2024', value: 1.68 },
    { period: 'Q2 2024', value: 1.74 },
    { period: 'Q3 2024', value: 1.79 },
    { period: 'Q4 2024', value: 1.84 },
  ],
}

// ─── Full portfolio snapshot ───────────────────────────────────────────────
export const portfolioSnapshot: PortfolioSnapshot = {
  asOf: '2024-Q4',
  kpis,
  holdings,
  allocation,
  timeSeries: {
    revenue: revenueSeries,
    ebitda: ebitdaSeries,
    sharpe: sharpeSeries,
  },
}

// ─── Query helpers ─────────────────────────────────────────────────────────
// These functions simulate what a real DB query would do.
// When you connect Supabase later, you replace the body — the signature stays.

export function getKPI(id: string): KPI | undefined {
  return portfolioSnapshot.kpis.find((k) => k.id === id)
}

export function getKPIsByPeriod(period: KPI['period']): KPI[] {
  return portfolioSnapshot.kpis.filter((k) => k.period === period)
}

export function getHoldingsBySector(sector: Holding['sector']): Holding[] {
  return portfolioSnapshot.holdings.filter((h) => h.sector === sector)
}

export function getTopHoldings(n: number): Holding[] {
  return [...portfolioSnapshot.holdings]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n)
}

export function getTimeSeries(id: 'revenue' | 'ebitda' | 'sharpe'): TimeSeries {
  return portfolioSnapshot.timeSeries[id]
}

export function compareKPI(id: string, periods: string[]): TimeSeriesPoint[] {
  // Simulates a period-over-period comparison query
  const series = Object.values(portfolioSnapshot.timeSeries)
    .find((s) => s.id === id)

  if (!series) return []

  return series.data.filter((point) =>
    periods.some((p) => point.period.includes(p))
  )
}

// ─── Metric catalog ───────────────────────────────────────────────────────
// This is what the LLM receives as context ("schema knowledge")

export const metricCatalog = portfolioSnapshot.kpis.map((k) => ({
  id: k.id,
  label: k.label,
  unit: k.unit,
  description: `${k.label} for the portfolio. Current value: ${k.formatted}. ${k.deltaLabel}.`,
}))