export interface Currency {
  usd_24h_change?: number;
  usd?: number;
}

export interface CurrencyPrices {
  bitcoin: Currency;
  steem: Currency;
  steem_dollars: Currency;
}
