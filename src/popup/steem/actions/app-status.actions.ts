import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { AppStatus } from '@popup/steem/reducers/app-status.reducer';

export const setProcessingDecryptAccount = (
  processingDecryptAccount: boolean,
) => {
  return {
    type: SteemActionType.SET_APP_STATUS,
    payload: {
      processingDecryptAccount: processingDecryptAccount,
    } as Partial<AppStatus>,
  };
};
