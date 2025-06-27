import { Message } from '@interfaces/message.interface';
import {
  loadActiveAccount,
  refreshKeys,
} from '@popup/steem/actions/active-account.actions';
import { setProcessingDecryptAccount } from '@popup/steem/actions/app-status.actions';
import AccountUtils from '@popup/steem/utils/account.utils';
import { KeyType } from 'src/interfaces/keys.interface';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import { ActionPayload, AppThunk } from '../../multichain/actions/interfaces';
import { SteemActionType } from './action-type.enum';

export const retrieveAccounts =
  (mk: string): AppThunk =>
  async (dispatch, getState) => {
    let accounts = await AccountUtils.getAccountsFromLocalStorage(mk);
    const action: ActionPayload<LocalAccount[]> = {
      type: SteemActionType.SET_ACCOUNTS,
      payload: accounts,
    };
    if (accounts) {
      dispatch(action);
      dispatch(setProcessingDecryptAccount(false));
    }
  };

export const addAccount = (account: LocalAccount) => {
  return {
    type: SteemActionType.ADD_ACCOUNT,
    payload: account,
  };
};

export const resetAccount = () => {
  return {
    type: SteemActionType.RESET_ACCOUNT,
  };
};

//export const setAccounts = (accounts: LocalAccount[]) => {
//  return {
//    type: SteemActionType.SET_ACCOUNTS,
//    payload: accounts,
//  };
//};

export const setAccounts = (accounts: LocalAccount[] | undefined) => {
  // console.log('[AccountActions] Setting accounts:', accounts);
  return {
    type: SteemActionType.SET_ACCOUNTS,
    payload: accounts || [], // Usa array vuoto se undefined
  };
};


export const addKey =
  (
    privateKey: string,
    keyType: KeyType,
    setErrorMessage: (key: string, params?: string[]) => ActionPayload<Message>,
  ): AppThunk =>
  async (dispatch, getState) => {
    const {
      steem: { activeAccount, accounts },
      mk,
    } = getState();
    let newAccounts;
    try {
      newAccounts = await AccountUtils.addKey(
        activeAccount,
        accounts,
        privateKey,
        keyType,
        mk,
      );
    } catch (err: any) {
      setErrorMessage(err.message);
    }

    if (newAccounts && newAccounts?.length > 0) {
      const activeLocalAccount = newAccounts.find(
        (account: LocalAccount) => account.name === activeAccount.name,
      );
      const action: ActionPayload<LocalAccount[]> = {
        type: SteemActionType.SET_ACCOUNTS,
        payload: newAccounts,
      };
      dispatch(action);
      dispatch(refreshKeys(activeLocalAccount!));
    }
  };

export const removeKey =
  (type: KeyType): AppThunk =>
  async (dispatch, getState) => {
    const {
      steem: { activeAccount, accounts },
      mk,
    } = getState();
    const activeLocalAccount = accounts.find(
      (account: LocalAccount) => account.name === activeAccount.name,
    );

    let newAccounts = AccountUtils.deleteKey(type, accounts, activeAccount, mk);

    const finalAccounts = [];
    for (let i = 0; i < newAccounts.length; i++) {
      let tmp = newAccounts[i];
      if (
        type === KeyType.ACTIVE &&
        tmp.keys.activePubkey === `@${activeAccount.name}`
      ) {
        delete tmp.keys.activePubkey;
        delete tmp.keys.active;
      }
      if (
        type === KeyType.POSTING &&
        tmp.keys.postingPubkey === `@${activeAccount.name}`
      ) {
        delete tmp.keys.posting;
        delete tmp.keys.postingPubkey;
      }
      if (
        type === KeyType.MEMO &&
        tmp.keys.memoPubkey === `@${activeAccount.name}`
      ) {
        delete tmp.keys.memo;
        delete tmp.keys.memoPubkey;
      }

      newAccounts[i] = tmp;

      if (Object.keys(newAccounts[i].keys).length > 0) {
        finalAccounts.push(newAccounts[i]);
      }
    }

    const action: ActionPayload<LocalAccount[]> = {
      type: SteemActionType.SET_ACCOUNTS,
      payload: finalAccounts,
    };

    dispatch(action);
    if (finalAccounts) {
      if (
        finalAccounts
          .map((account: LocalAccount) => account.name)
          .includes(activeLocalAccount!.name)
      ) {
        const updated = finalAccounts.filter(
          (account: LocalAccount) => account.name === activeLocalAccount!.name,
        );
        dispatch(refreshKeys(updated[0]));
      } else {
        dispatch(loadActiveAccount(accounts[0]));
      }
    }
  };
