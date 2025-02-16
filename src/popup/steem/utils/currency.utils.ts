export interface CurrencyLabels {
  steem: string;
  sbd: string;
  sp: string;
}

export enum BaseCurrencies {
  STEEM = 'steem',
  SBD = 'sbd',
}

const getCurrencyLabels = (isTestnet: boolean): CurrencyLabels => {
  return {
    steem: isTestnet ? 'TESTS' : 'STEEM',
    sbd: isTestnet ? 'TBD' : 'SBD',
    sp: isTestnet ? 'TP' : 'SP',
  };
};

const getCurrencyLabel = (currency: string, isTestnet: boolean) => {
  const cur = currency.toLowerCase() as BaseCurrencies;
  const label = getCurrencyLabels(isTestnet)[cur];
  return label ? label : cur.toUpperCase();
};

const CurrencyUtils = {
  getCurrencyLabels,
  getCurrencyLabel,
};

export default CurrencyUtils;
