import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';

export const PhishingReducer = (
  state: string[] = [],
  { type, payload }: ActionPayload<string[]>,
) => {
  switch (type) {
    case SteemActionType.FETCH_PHISHING_ACCOUNTS:
      return payload!;
    default:
      return state;
  }
};
