export interface CurrencyLabels {
  steem: string;
  sbd: string;
  sp: string;
  time: string;
}

export enum BaseCurrencies {
  STEEM = 'steem',
  SBD = 'sbd',
  TIME = 'time',
}

const getCurrencyLabels = (isTestnet: boolean): CurrencyLabels => {
  return {
    steem: isTestnet ? 'TESTS' : 'STEEM',
    sbd: isTestnet ? 'TBD' : 'SBD',
    sp: isTestnet ? 'TP' : 'SP',
    time: isTestnet ? 'TIME' : 'TIME',
  };
};

const getCurrencyLabel = (currency: string, isTestnet: boolean) => {
  const cur = currency.toLowerCase() as BaseCurrencies;
  const label = getCurrencyLabels(isTestnet)[cur];
  if (currency.toLowerCase() === 'time') {
	 return currency.toUpperCase(); 
  } else {
    return label ? label : cur.toUpperCase();
  }
};

const CurrencyUtils = {
  getCurrencyLabels,
  getCurrencyLabel,
};

export default CurrencyUtils;
