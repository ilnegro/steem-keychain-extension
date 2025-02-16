export interface Witness {
  rank?: number;
  owner: string;
  votes: number;
  signing_key: string;
  url: string;
  id: number;
  created: string;
  virtual_last_update: string;
  virtual_position: string;
  virtual_scheduled_time: string;
  total_missed: number;
  last_aslot: number;
  last_confirmed_block_num: number;
  pow_worker: 0;
  props: {
    account_creation_fee: string;
    maximum_block_size: number;
    sbd_interest_rate: number;
    account_subsidy_budget: number;
    account_subsidy_decay: number;
  };
  sbd_exchange_rate: {
    base: string;
    quote: string;
  };
  last_sbd_exchange_update: string;
  last_work: string;
  running_version: string;
  hardfork_version_vote: string;
  hardfork_time_vote: string;
  available_witness_account_subsidies: number;
}

export interface WitnessParams {
  accountCreationFee: number;
  accountCreationFeeFormatted: string;
  maximumBlockSize: number;
  sbdInterestRate: number;
}
export interface WitnessInfo {
  username: string;
  votesCount: number;
  voteValueInSP: string;
  blockMissed: number;
  lastBlock: string;
  lastBlockUrl: string;
  priceFeed: string;
  priceFeedUpdatedAt: moment.Moment;
  priceFeedUpdatedAtWarning: boolean;

  signingKey: string;
  url: string;
  version: string;
  isDisabled: boolean;
  params: WitnessParams;
  rewards: {
    lastMonthValue: number;
    lastMonthInSP: string;
    lastMonthInUSD: string;
    lastWeekValue: number;
    lastWeekInSP: string;
    lastWeekInUSD: string;
    lastYearValue: number;
    lastYearInSP: string;
    lastYearInUSD: string;
  };
}

export interface WitnessParamsForm {
  accountCreationFee: number;
  maximumBlockSize: number;
  sbdInterestRate: number;
  signingKey: string;
  url: string;
}

export type WitnessFormField = keyof WitnessParamsForm;

export interface LastSigningKeys {
  [username: string]: string;
}
