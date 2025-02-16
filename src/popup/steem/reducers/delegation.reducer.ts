import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { Delegations } from 'src/interfaces/delegations.interface';

const DelegationsReducer = (
  state: Delegations = {
    incoming: [],
    outgoing: [],
    pendingOutgoingUndelegation: [],
  },
  { type, payload }: ActionPayload<Delegations>,
) => {
  switch (type) {
    case SteemActionType.FETCH_DELEGATEES:
      return { ...state, outgoing: payload!.outgoing };
    case SteemActionType.FETCH_DELEGATORS:
      return { ...state, incoming: payload!.incoming };
    case SteemActionType.FETCH_PENDING_OUTGOING_UNDELEGATION:
      return {
        ...state,
        pendingOutgoingUndelegation: payload!.pendingOutgoingUndelegation,
      };
    default:
      return state;
  }
};

export default DelegationsReducer;
