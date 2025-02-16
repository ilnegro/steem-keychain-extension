import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { TokenTransaction } from 'src/interfaces/tokens.interface';

const TokenHistoryReducer = (
  state: {
    loading: boolean;
    shouldLoadMore: boolean;
    list: TokenTransaction[];
  } = {
    loading: false,
    shouldLoadMore: false,
    list: [],
  },
  {
    type,
    payload,
  }: ActionPayload<{
    transactions: TokenTransaction[];
    shouldLoadMore: boolean;
  }>,
) => {
  switch (type) {
    case SteemActionType.INIT_TOKEN_HISTORY:
      return { loading: true, list: [], shouldLoadMore: false };
    case SteemActionType.LOAD_TOKEN_HISTORY:
      return {
        loading: false,
        list: payload?.transactions!,
        shouldLoadMore: payload?.shouldLoadMore!,
      };
    case SteemActionType.FETCH_MORE_TOKEN_HISTORY:
      return {
        loading: false,
        list: [...state.list, ...payload?.transactions!],
        shouldLoadMore: payload?.shouldLoadMore!,
      };
    case SteemActionType.IS_LOADING:
      return { ...state, loading: true };

    default:
      return state;
  }
};

export default TokenHistoryReducer;
