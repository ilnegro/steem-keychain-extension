export interface SteemEngineConfig {
  rpc: string;
  mainnet: string;
  accountHistoryApi: string;
}

export const DefaultSteemEngineRpcs: SteemEngineConfig['rpc'][] = [
  'https://api.steem-engine.com/rpc',
];

export const DefaultAccountHistoryApis: SteemEngineConfig['accountHistoryApi'][] =
  ['https://history.steem-engine.com'];
