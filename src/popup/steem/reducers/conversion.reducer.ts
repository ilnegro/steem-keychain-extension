import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { Conversion } from 'src/interfaces/conversion.interface';

const ConversionsReducer = (
  state: Conversion[] = [],
  { type, payload }: ActionPayload<Conversion[]>,
) => {
  switch (type) {
    case SteemActionType.FETCH_CONVERSION_REQUESTS:
      return payload!;
    default:
      return state;
  }
};

export default ConversionsReducer;
