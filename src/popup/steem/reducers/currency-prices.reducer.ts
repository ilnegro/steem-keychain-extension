import { ActionPayload } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { CurrencyPrices } from 'src/interfaces/bittrex.interface';

const CurrencyPricesReducer = (
  state: CurrencyPrices = { bitcoin: {}, steem: {}, steem_dollars: {} },
  { type, payload }: ActionPayload<CurrencyPrices>,
) => {
  switch (type) {
    case SteemActionType.LOAD_CURRENCY_PRICES:
      return payload!;
    default:
      return state;
  }
};

export default CurrencyPricesReducer;
