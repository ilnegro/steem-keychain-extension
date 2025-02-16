import { AppThunk } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { ConversionUtils } from '@popup/steem/utils/conversion.utils';

export const fetchConversionRequests =
  (name: string): AppThunk =>
  async (dispatch) => {
    const conversions = await ConversionUtils.getConversionRequests(name);
    dispatch({
      type: SteemActionType.FETCH_CONVERSION_REQUESTS,
      payload: conversions,
    });
  };
