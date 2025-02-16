export interface UserPortfolio {
  account: string;
  balances: PortfolioBalance[];
  totalSteem: number;
  totalUSD: number;
}

export interface PortfolioBalance {
  symbol: string;
  balance: number;
  usdValue: number;
}
