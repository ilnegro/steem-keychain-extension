import { TokenMarket } from '@interfaces/tokens.interface';
import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';

const TokenMarketReducer = (
  state: TokenMarket[] = [],
  { type, payload }: ActionPayload<TokenMarket[]>,
) => {
  switch (type) {
    case SteemActionType.LOAD_TOKENS_MARKET:
      return payload!;
    default:
      return state;
  }
};

export default TokenMarketReducer;
