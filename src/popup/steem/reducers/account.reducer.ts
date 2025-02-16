import { LocalAccount } from '@interfaces/local-account.interface';
import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';

export const AccountReducer = (
  state: LocalAccount[] = [],
  { type, payload }: ActionPayload<any>,
): LocalAccount[] => {
  switch (type) {
    case SteemActionType.GET_ACCOUNTS: {
      const accounts: LocalAccount[] = payload;
      return accounts!;
    }
    case SteemActionType.SET_ACCOUNTS: {
      const accounts: LocalAccount[] = payload;
      return accounts;
    }
    case SteemActionType.ADD_ACCOUNT: {
      const account: LocalAccount = payload;
      return [...state, account];
    }
    case SteemActionType.RESET_ACCOUNT:
      return [];
    default:
      return state;
  }
};
