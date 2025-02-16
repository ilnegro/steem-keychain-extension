import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { GlobalProperties } from 'src/interfaces/global-properties.interface';

const GlobalPropertiesReducer = (
  state: GlobalProperties = {},
  { type, payload }: ActionPayload<GlobalProperties>,
): GlobalProperties => {
  switch (type) {
    case SteemActionType.LOAD_GLOBAL_PROPS:
      return payload!;
    default:
      return state;
  }
};

export default GlobalPropertiesReducer;
