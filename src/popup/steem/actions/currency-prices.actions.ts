import { AppThunk } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { AppStatus } from '@popup/steem/reducers/app-status.reducer';
import CurrencyPricesUtils from '@popup/steem/utils/currency-prices.utils';
import Logger from 'src/utils/logger.utils';

export const loadCurrencyPrices = (): AppThunk => async (dispatch) => {
  try {
    const prices = await CurrencyPricesUtils.getPrices();
    dispatch({
      type: SteemActionType.LOAD_CURRENCY_PRICES,
      payload: prices,
    });
    dispatch({
      type: SteemActionType.SET_APP_STATUS,
      payload: { priceLoaded: true } as AppStatus,
    });
  } catch (e) {
    Logger.error('currency price error', (e as any).toString());
  }
};
