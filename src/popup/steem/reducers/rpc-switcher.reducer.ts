import { Rpc } from '@interfaces/rpc.interface';
import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';

type Switcher = {
  display: boolean;
  rpc?: Rpc;
};
export const RpcSwitcherReducer = (
  state: Switcher = { display: false },
  { type, payload }: ActionPayload<boolean | Rpc>,
): Switcher => {
  switch (type) {
    case SteemActionType.SET_SWITCH_TO_RPC:
      return { ...state, rpc: payload as Rpc };
    case SteemActionType.SET_DISPLAY_SWITCH_RPC:
      return { ...state, display: payload as boolean };
    default:
      return state;
  }
};
