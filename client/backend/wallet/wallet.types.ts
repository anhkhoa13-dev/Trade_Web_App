

export type AssetDTO = {
    balance: number
    coinHoldings: CoinHolding[]
    totalEquity: number
    netInvestment: number
    pnl: number
    roi: number
    maxDrawdown: number
    maxDrawdownPct: number
    pnlChartData: ChartDataPoint[]
}
export type CoinHolding = {
    coinSymbol: string
    coinName: string
    amount: number
}

export type ChartDataPoint = {
    timestamp: string
    value: number
}


