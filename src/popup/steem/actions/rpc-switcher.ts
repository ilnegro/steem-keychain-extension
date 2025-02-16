import { Rpc } from '@interfaces/rpc.interface';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';

export const setSwitchToRpc = (rpc: Rpc) => {
  return {
    type: SteemActionType.SET_SWITCH_TO_RPC,
    payload: rpc,
  };
};

export const setDisplayChangeRpcPopup = (display: boolean) => {
  return {
    type: SteemActionType.SET_DISPLAY_SWITCH_RPC,
    payload: display,
  };
};
