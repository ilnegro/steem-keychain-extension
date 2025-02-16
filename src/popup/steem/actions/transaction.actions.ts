import { LocalAccount } from '@interfaces/local-account.interface';
import { AppThunk } from '@popup/multichain/actions/interfaces';
import { store } from '@popup/multichain/store';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import TransactionUtils from '@popup/steem/utils/transaction.utils';

export const initAccountTransactions =
  (accountName: string): AppThunk =>
  async (dispatch, getState) => {
    const memoKey = getState().steem.accounts.find(
      (a: LocalAccount) => a.name === accountName,
    )!.keys.memo;
    const result = await TransactionUtils.getAccountTransactions(
      accountName,
      -1,
      store.getState().steem.globalProperties.globals!,
      memoKey!,
    );

    dispatch({
      type: SteemActionType.INIT_TRANSACTIONS,
      payload: result,
    });
  };

export const fetchAccountTransactions =
  (accountName: string, start: number): AppThunk =>
  async (dispatch, getState) => {
    const memoKey = getState().steem.accounts.find(
      (a: LocalAccount) => a.name === accountName,
    )!.keys.memo;
    const result = await TransactionUtils.getAccountTransactions(
      accountName,
      start,
      store.getState().steem.globalProperties.globals!,
      memoKey!,
    );

    dispatch({
      type: SteemActionType.ADD_TRANSACTIONS,
      payload: result,
    });
  };
