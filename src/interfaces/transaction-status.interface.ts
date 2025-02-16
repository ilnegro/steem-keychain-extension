export interface SteemEngineTransactionStatus {
  broadcasted: boolean;
  confirmed: boolean;
  tx_id: string;
  isUsingMultisig?: boolean;
}
