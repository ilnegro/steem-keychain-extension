import { ActionPayload, AppThunk } from '@popup/multichain/actions/interfaces';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { AppStatus } from '@popup/steem/reducers/app-status.reducer';
import { DynamicGlobalPropertiesUtils } from '@popup/steem/utils/dynamic-global-properties.utils';
import SteemUtils from '@popup/steem/utils/steem.utils';
import { GlobalProperties } from 'src/interfaces/global-properties.interface';
import Logger from 'src/utils/logger.utils';

export const loadGlobalProperties = (): AppThunk => async (dispatch) => {
  try {
    const [globals, price, rewardFund] = await Promise.all([
      DynamicGlobalPropertiesUtils.getDynamicGlobalProperties(),
      SteemUtils.getCurrentMedianHistoryPrice(),
      SteemUtils.getRewardFund(),
    ]);
    const props = { globals, price, rewardFund };
    const action: ActionPayload<GlobalProperties> = {
      type: SteemActionType.LOAD_GLOBAL_PROPS,
      payload: props,
    };
    dispatch(action);
    dispatch({
      type: SteemActionType.SET_APP_STATUS,
      payload: { globalPropertiesLoaded: true } as AppStatus,
    });
  } catch (err) {
    Logger.error(err);
  }
};
