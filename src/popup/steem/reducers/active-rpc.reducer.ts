import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { Rpc } from 'src/interfaces/rpc.interface';

export const ActiveRpcReducer = (
  state: Rpc = { uri: 'NULL', testnet: false },
  { type, payload }: ActionPayload<Rpc>,
) => {
  switch (type) {
    case SteemActionType.SET_ACTIVE_RPC:
      return payload;
    default:
      return state;
  }
};
