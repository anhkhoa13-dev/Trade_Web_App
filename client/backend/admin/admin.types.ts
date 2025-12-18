export interface CoinHolding {
  coinSymbol: string;
  coinName: string;
  amount: number;
  fee: number;
}

export interface PnLChartDataPoint {
  timestamp: string;
  value: number;
}

export interface AdminAssetsDTO {
  balance: number;
  coinHoldings: CoinHolding[];
  totalEquity: number;
  netInvestment: number;
  pnl: number;
  roi: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  pnlChartData: PnLChartDataPoint[];
}

export interface CoinFeeUpdateItem {
  symbol: string;
  fee: number;
}

export interface CoinFeeUpdateRequest {
  coins: CoinFeeUpdateItem[];
}
