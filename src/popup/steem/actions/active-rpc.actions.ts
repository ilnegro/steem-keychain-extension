import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import { BackgroundCommand } from '@reference-data/background-message-key.enum';
import { Rpc } from 'src/interfaces/rpc.interface';

export const setActiveRpc = (rpc: Rpc) => {
  SteemTxUtils.setRpc(rpc);
  chrome.runtime.sendMessage({
    command: BackgroundCommand.SAVE_RPC,
    value: rpc,
  });
  return {
    type: SteemActionType.SET_ACTIVE_RPC,
    payload: rpc,
  };
};
