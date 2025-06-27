import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import { Rpc } from 'src/interfaces/rpc.interface';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import { Dispatch } from 'redux';

export const setActiveRpc = (rpc: Rpc) => async (dispatch: Dispatch) => {
  // console.log('[ActiveRpcActions] Setting active RPC:', rpc);
  try {
    // Configura SteemTxUtils
    SteemTxUtils.setRpc(rpc);
    // Salva l'RPC in Preferences
    await LocalStorageUtils.saveValueInLocalStorage(
      LocalStorageKeyEnum.CURRENT_RPC,
      rpc,
    );
    // console.log('[ActiveRpcActions] RPC saved to Preferences');
    // Dispatch dell'azione Redux
    dispatch({
      type: SteemActionType.SET_ACTIVE_RPC,
      payload: rpc,
    });
    // console.log('[ActiveRpcActions] Active RPC set');
  } catch (error) {
    console.error('[ActiveRpcActions] Error setting active RPC:', error);
  }
};
