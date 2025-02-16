import { AppThunk } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import AccountUtils from '@popup/steem/utils/account.utils';
import { LocalAccount } from 'src/interfaces/local-account.interface';

const TIME_REFERENCE = 1643236071000;

export const refreshActiveAccount =
  (): AppThunk => async (dispatch, getState) => {
    const delay = Math.min(
      ((Date.now() - TIME_REFERENCE) % 3) * 1000 + 100,
      3000,
    );
    setTimeout(() => {
      const account = getState().steem.accounts.find(
        (localAccount: LocalAccount) =>
          localAccount.name === getState().steem.activeAccount.name,
      );
      dispatch(loadActiveAccount(account!));
    }, delay);
  };

export const refreshKeys = (localAccount: LocalAccount) => {
  return {
    type: SteemActionType.SET_ACTIVE_ACCOUNT,
    payload: {
      keys: localAccount.keys,
    },
  };
};

export const loadActiveAccount =
  (account: LocalAccount): AppThunk =>
  async (dispatch, getState) => {
    if (
      account &&
      getState().steem.activeRpc &&
      getState().steem.activeRpc?.uri !== 'NULL'
    ) {
      dispatch(refreshKeys(account));
      dispatch(getAccountRC(account.name));
      const extendedAccount = await AccountUtils.getExtendedAccount(
        account.name,
      );
      dispatch({
        type: SteemActionType.SET_ACTIVE_ACCOUNT,
        payload: {
          account: extendedAccount,
          name: account.name,
        },
      });
    }
  };

export const getAccountRC =
  (username: string): AppThunk =>
  async (dispatch) => {
    const rc = await AccountUtils.getRCMana(username);
    dispatch({
      type: SteemActionType.SET_ACTIVE_ACCOUNT_RC,
      payload: rc,
    });
  };

export const resetActiveAccount = () => {
  return {
    type: SteemActionType.RESET_ACTIVE_ACCOUNT,
  };
};
