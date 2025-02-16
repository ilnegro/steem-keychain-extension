import { utils as DSteemUtils, DynamicGlobalProperties } from '@hiveio/dhive';
import {
  ClaimAccount,
  ClaimReward,
  Convert,
  CreateAccount,
  CreateClaimedAccount,
  Delegation,
  DepositSavings,
  FillConvert,
  PowerDown,
  PowerUp,
  ReceivedInterests,
  StartWithdrawSavings,
  Transaction,
  Transfer,
  WithdrawSavings,
} from '@interfaces/transaction.interface';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import SteemUtils from '@popup/steem/utils/steem.utils';
import { KeychainError } from 'src/keychain-error';
import FormatUtils from 'src/utils/format.utils';
import Logger from 'src/utils/logger.utils';

export const NB_TRANSACTION_FETCHED = 20;
export const HAS_IN_OUT_TRANSACTIONS = ['transfer', 'delegate_vesting_shares'];
export const TRANSFER_TYPE_TRANSACTIONS = [
  'transfer',
  'fill_reccurent_transfer',
  'recurrent_transfer',
];

export const CONVERT_TYPE_TRANSACTIONS = [
  'convert',
  'fill_collateralized_convert_request',
  'fill_convert_request',
  'collateralized_convert',
];

const getAccountTransactions = async (
  accountName: string,
  start: number,
  globals: DynamicGlobalProperties,
  memoKey?: string,
): Promise<[Transaction[], number]> => {
  try {
    let limit = Math.min(start, 20);

    if (limit <= 0) return [[], 0];

    const transactionsFromBlockchain = await TransactionUtils.getTransactions(
      accountName,
      start,
      limit,
    );
    const transactions = transactionsFromBlockchain
      .map((e: any) => {
        let specificTransaction = null;
        switch (e[1].op[0]) {
          case 'transfer': {
            specificTransaction = e[1].op[1] as Transfer;
            specificTransaction = decodeMemoIfNeeded(
              specificTransaction,
              memoKey!,
            );
            break;
          }

          case 'claim_reward_balance': {
            specificTransaction = e[1].op[1] as ClaimReward;
            specificTransaction.sbd = e[1].op[1].reward_sbd;
            specificTransaction.steem = e[1].op[1].reward_steem;
            specificTransaction.sp = `${FormatUtils.toSP(
              e[1].op[1].reward_vests,
              globals,
            ).toFixed(3)} SP`;
            break;
          }
          case 'delegate_vesting_shares': {
            specificTransaction = e[1].op[1] as Delegation;
            specificTransaction.amount = `${FormatUtils.toSP(
              e[1].op[1].vesting_shares,
              globals,
            ).toFixed(3)} SP`;
            break;
          }
          case 'transfer_to_vesting': {
            specificTransaction = e[1].op[1] as PowerUp;
            specificTransaction.type = 'power_up_down';
            specificTransaction.subType = 'transfer_to_vesting';
            break;
          }
          case 'withdraw_vesting': {
            specificTransaction = e[1].op[1] as PowerDown;
            specificTransaction.type = 'power_up_down';
            specificTransaction.subType = 'withdraw_vesting';
            specificTransaction.amount = `${FormatUtils.toSP(
              e[1].op[1].vesting_shares,
              globals,
            ).toFixed(3)} SP`;
            break;
          }
          case 'interest': {
            specificTransaction = e[1].op[1] as ReceivedInterests;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'interest';
            break;
          }
          case 'transfer_to_savings': {
            specificTransaction = e[1].op[1] as DepositSavings;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'transfer_to_savings';
            break;
          }
          case 'transfer_from_savings': {
            specificTransaction = e[1].op[1] as StartWithdrawSavings;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'transfer_from_savings';
            break;
          }
          case 'fill_transfer_from_savings': {
            specificTransaction = e[1].op[1] as WithdrawSavings;
            specificTransaction.type = 'savings';
            specificTransaction.subType = 'fill_transfer_from_savings';
            break;
          }
          case 'claim_account': {
            specificTransaction = e[1].op[1] as ClaimAccount;
            break;
          }
          case 'convert': {
            specificTransaction = e[1].op[1] as Convert;
            specificTransaction.type = 'convert';
            specificTransaction.subType = 'convert';
            break;
          }
          case 'fill_convert_request': {
            specificTransaction = e[1].op[1] as FillConvert;
            specificTransaction.type = 'convert';
            specificTransaction.subType = 'fill_convert_request';
            break;
          }
          case 'create_claimed_account': {
            specificTransaction = e[1].op[1] as CreateClaimedAccount;
            break;
          }
          case 'account_create': {
            specificTransaction = e[1].op[1] as CreateAccount;
            break;
          }
        }
        const tr: Transaction = {
          ...specificTransaction,
          type: specificTransaction!.type ?? e[1].op[0],
          timestamp: e[1].timestamp,
          key: `${accountName}!${e[0]}`,
          index: e[0],
          txId: e[1].trx_id,
          blockNumber: e[1].block,
          url: `https://steemdb.io/block/${e[1].block}`,
          last: false,
          lastFetched: false,
        };
        return tr;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    if (start - NB_TRANSACTION_FETCHED < 0 && transactions.length > 1) {
      transactions[transactions.length - 1].last = true;
    }

    if (
      start &&
      Math.min(NB_TRANSACTION_FETCHED, start) !== NB_TRANSACTION_FETCHED &&
      transactions.length > 1
    ) {
      transactions[transactions.length - 1].lastFetched = true;
    }
    return [transactions, start];
  } catch (e) {
    Logger.error(e, e);
    return getAccountTransactions(
      accountName,
      (e as any).jse_info.stack[0].data.sequence - 1,
      globals,
      memoKey,
    );
  }
};

const getLastTransaction = async (accountName: string) => {
  const transactionsFromBlockchain = await TransactionUtils.getTransactions(
    accountName,
    -1,
    1,
  );

  return transactionsFromBlockchain.length > 0
    ? transactionsFromBlockchain[0][0]
    : -1;
};

const getTransactions = (account: string, start: number, limit: number) => {
  return SteemTxUtils.getData('condenser_api.get_account_history', [
    account,
    start,
    limit,
  ]);
};

const decodeMemoIfNeeded = (transfer: Transfer, memoKey: string) => {
  const { memo } = transfer;
  if (memo[0] === '#') {
    if (memoKey) {
      try {
        const decodedMemo = SteemUtils.decodeMemo(memo, memoKey);
        transfer.memo = decodedMemo.substring(1);
      } catch (e) {
        if (e instanceof KeychainError) {
          transfer.memo = chrome.i18n.getMessage(
            'decode_with_memo_key_in_ledger',
          );
        }
        Logger.error('Error while decoding', '');
      }
    } else {
      transfer.memo = chrome.i18n.getMessage('popup_accounts_add_memo');
    }
  }
  return transfer;
};

const getExpirationTime = () => {
  return new Date(Date.now() + 60 * 1000).toISOString().slice(0, -5);
};

const TransactionUtils = {
  getAccountTransactions,
  getLastTransaction,
  decodeMemoIfNeeded,
  getExpirationTime,
  getTransactions,
};

export default TransactionUtils;
